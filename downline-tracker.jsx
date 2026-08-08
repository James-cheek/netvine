import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ============================================================
   DOWNLINE TRACKER
   - Zoomable / pannable org chart (circles + lines + names)
   - Auto-layout with proper spacing at every level
   - Click a member -> profile page: progress, current issue,
     proposed solution, tracking log
   - Data persists via window.storage
   ============================================================ */

const STORAGE_KEY = "downline-tracker-v1";

const COLORS = {
  canvas: "#F4F3EE",
  ink: "#1C2B27",
  line: "#B9C4BE",
  accent: "#2F7D5D",
  paper: "#FFFFFF",
  muted: "#75837D",
  soft: "#E5E8E2",
};

const STATUS = {
  New: { color: "#5B7A8C", label: "New" },
  Active: { color: "#2F7D5D", label: "Active" },
  Growing: { color: "#1F5C42", label: "Growing" },
  Stalled: { color: "#C08A2D", label: "Stalled" },
  Inactive: { color: "#A05252", label: "Inactive" },
};

const R = 27; // circle radius
const X_GAP = 46; // horizontal gap between sibling subtrees
const LEVEL_H = 128; // vertical distance between levels

let idCounter = 0;
const newId = () => `m_${Date.now().toString(36)}_${(idCounter++).toString(36)}`;

function makeMember(name, parentId = null) {
  return {
    id: newId(),
    name,
    parentId,
    children: [],
    progress: "New",
    currentIssue: "",
    proposedSolution: "",
    joined: new Date().toISOString().slice(0, 10),
    tracking: [],
  };
}

function defaultData() {
  const root = makeMember("Me");
  return { rootId: root.id, nodes: { [root.id]: root } };
}

/* ---------- tidy tree layout with guaranteed spacing ---------- */
function computeLayout(data) {
  const positions = {};
  if (!data.rootId || !data.nodes[data.rootId]) return { positions, width: 0, height: 0 };

  const nodeSpan = R * 2 + 44; // circle + room for the name label

  function subtreeWidth(id) {
    const n = data.nodes[id];
    if (!n) return 0;
    if (!n.children.length) return nodeSpan;
    let w = 0;
    n.children.forEach((c, i) => {
      w += subtreeWidth(c);
      if (i < n.children.length - 1) w += X_GAP;
    });
    return Math.max(nodeSpan, w);
  }

  let maxDepth = 0;
  function place(id, left, depth) {
    const n = data.nodes[id];
    if (!n) return;
    maxDepth = Math.max(maxDepth, depth);
    const w = subtreeWidth(id);
    if (!n.children.length) {
      positions[id] = { x: left + w / 2, y: depth * LEVEL_H };
      return;
    }
    let cursor = left + (w - childrenWidth(n)) / 2;
    n.children.forEach((c) => {
      const cw = subtreeWidth(c);
      place(c, cursor, depth + 1);
      cursor += cw + X_GAP;
    });
    const first = positions[n.children[0]];
    const last = positions[n.children[n.children.length - 1]];
    positions[id] = { x: (first.x + last.x) / 2, y: depth * LEVEL_H };
  }

  function childrenWidth(n) {
    let w = 0;
    n.children.forEach((c, i) => {
      w += subtreeWidth(c);
      if (i < n.children.length - 1) w += X_GAP;
    });
    return w;
  }

  place(data.rootId, 0, 0);
  return {
    positions,
    width: subtreeWidth(data.rootId),
    height: maxDepth * LEVEL_H,
  };
}

/* ============================ APP ============================ */
export default function DownlineTracker() {
  const [data, setData] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [profileId, setProfileId] = useState(null);
  const [addingUnder, setAddingUnder] = useState(null);
  const [renaming, setRenaming] = useState(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [saveState, setSaveState] = useState("idle");
  const containerRef = useRef(null);
  const dragRef = useRef(null);
  const pinchRef = useRef(null);
  const loadedRef = useRef(false);

  /* ---------- load ---------- */
  useEffect(() => {
    (async () => {
      let loaded = null;
      try {
        const res = await window.storage.get(STORAGE_KEY);
        if (res && res.value) loaded = JSON.parse(res.value);
      } catch (e) {
        /* first run: nothing saved yet */
      }
      setData(loaded || defaultData());
      loadedRef.current = true;
    })();
  }, []);

  /* ---------- save (debounced) ---------- */
  useEffect(() => {
    if (!data || !loadedRef.current) return;
    setSaveState("saving");
    const t = setTimeout(async () => {
      try {
        await window.storage.set(STORAGE_KEY, JSON.stringify(data));
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 1500);
      } catch (e) {
        setSaveState("error");
      }
    }, 600);
    return () => clearTimeout(t);
  }, [data]);

  const layout = useMemo(() => (data ? computeLayout(data) : null), [data]);

  /* ---------- fit view ---------- */
  const fitView = useCallback(() => {
    if (!layout || !containerRef.current) return;
    const el = containerRef.current;
    const cw = el.clientWidth;
    const ch = el.clientHeight;
    const pad = 70;
    const w = layout.width + pad * 2;
    const h = layout.height + R * 2 + 60 + pad * 2;
    const k = Math.min(cw / w, ch / h, 1.4);
    const xs = Object.values(layout.positions).map((p) => p.x);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const midX = (minX + maxX) / 2;
    setTransform({
      x: cw / 2 - midX * k,
      y: pad * k + 30,
      k,
    });
  }, [layout]);

  const fittedOnce = useRef(false);
  useEffect(() => {
    if (layout && !fittedOnce.current && containerRef.current) {
      fittedOnce.current = true;
      fitView();
    }
  }, [layout, fitView]);

  /* ---------- zoom helpers ---------- */
  const zoomAt = useCallback((cx, cy, factor) => {
    setTransform((t) => {
      const k = Math.min(3, Math.max(0.15, t.k * factor));
      const ratio = k / t.k;
      return {
        k,
        x: cx - (cx - t.x) * ratio,
        y: cy - (cy - t.y) * ratio,
      };
    });
  }, []);

  const zoomButtons = (dir) => {
    const el = containerRef.current;
    if (!el) return;
    zoomAt(el.clientWidth / 2, el.clientHeight / 2, dir > 0 ? 1.25 : 0.8);
  };

  /* ---------- wheel zoom (non-passive) ---------- */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      zoomAt(e.clientX - rect.left, e.clientY - rect.top, e.deltaY < 0 ? 1.12 : 0.9);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [zoomAt, profileId]);

  /* ---------- pan (mouse) ---------- */
  const onMouseDown = (e) => {
    if (e.button !== 0) return;
    dragRef.current = { sx: e.clientX, sy: e.clientY, ox: transform.x, oy: transform.y, moved: false };
  };
  const onMouseMove = (e) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.sx;
    const dy = e.clientY - d.sy;
    if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
    setTransform((t) => ({ ...t, x: d.ox + dx, y: d.oy + dy }));
  };
  const onMouseUp = () => {
    const d = dragRef.current;
    dragRef.current = null;
    if (d && !d.moved) setSelectedId(null);
  };

  /* ---------- touch: pan + pinch ---------- */
  const onTouchStart = (e) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      dragRef.current = { sx: t.clientX, sy: t.clientY, ox: transform.x, oy: transform.y, moved: false };
    } else if (e.touches.length === 2) {
      dragRef.current = null;
      const [a, b] = e.touches;
      pinchRef.current = {
        dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
      };
    }
  };
  const onTouchMove = (e) => {
    if (e.touches.length === 1 && dragRef.current) {
      const t = e.touches[0];
      const d = dragRef.current;
      const dx = t.clientX - d.sx;
      const dy = t.clientY - d.sy;
      if (Math.abs(dx) + Math.abs(dy) > 3) d.moved = true;
      setTransform((tr) => ({ ...tr, x: d.ox + dx, y: d.oy + dy }));
    } else if (e.touches.length === 2 && pinchRef.current) {
      const [a, b] = e.touches;
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
      const el = containerRef.current;
      const rect = el.getBoundingClientRect();
      const cx = (a.clientX + b.clientX) / 2 - rect.left;
      const cy = (a.clientY + b.clientY) / 2 - rect.top;
      zoomAt(cx, cy, dist / pinchRef.current.dist);
      pinchRef.current.dist = dist;
    }
  };
  const onTouchEnd = () => {
    const d = dragRef.current;
    dragRef.current = null;
    if (d && !d.moved && !pinchRef.current) setSelectedId(null);
    pinchRef.current = null;
  };

  /* ---------- data operations ---------- */
  const addMember = (parentId, name) => {
    setData((prev) => {
      const m = makeMember(name.trim(), parentId);
      const nodes = { ...prev.nodes, [m.id]: m };
      nodes[parentId] = {
        ...nodes[parentId],
        children: [...nodes[parentId].children, m.id],
      };
      return { ...prev, nodes };
    });
  };

  const renameMember = (id, name) => {
    setData((prev) => ({
      ...prev,
      nodes: { ...prev.nodes, [id]: { ...prev.nodes[id], name: name.trim() } },
    }));
  };

  const updateMember = (id, patch) => {
    setData((prev) => ({
      ...prev,
      nodes: { ...prev.nodes, [id]: { ...prev.nodes[id], ...patch } },
    }));
  };

  const deleteMember = (id) => {
    setData((prev) => {
      if (id === prev.rootId) return prev;
      const nodes = { ...prev.nodes };
      const removeTree = (nid) => {
        const n = nodes[nid];
        if (!n) return;
        n.children.forEach(removeTree);
        delete nodes[nid];
      };
      const parent = nodes[nodes[id].parentId];
      if (parent) {
        nodes[parent.id] = { ...parent, children: parent.children.filter((c) => c !== id) };
      }
      removeTree(id);
      return { ...prev, nodes };
    });
    setSelectedId(null);
    setProfileId(null);
  };

  if (!data || !layout) {
    return (
      <div style={{ ...styles.page, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: COLORS.muted, fontFamily: "Georgia, serif", fontSize: 18 }}>
          Opening your downline…
        </div>
      </div>
    );
  }

  const selected = selectedId ? data.nodes[selectedId] : null;
  const teamCount = Object.keys(data.nodes).length - 1;

  /* ============================ RENDER ============================ */
  if (profileId && data.nodes[profileId]) {
    return (
      <ProfilePage
        member={data.nodes[profileId]}
        parent={data.nodes[profileId].parentId ? data.nodes[data.nodes[profileId].parentId] : null}
        isRoot={profileId === data.rootId}
        onBack={() => setProfileId(null)}
        onUpdate={(patch) => updateMember(profileId, patch)}
        onDelete={() => {
          if (window.confirm(`Remove ${data.nodes[profileId].name} and everyone under them?`)) {
            deleteMember(profileId);
          }
        }}
        saveState={saveState}
      />
    );
  }

  return (
    <div style={styles.page}>
      {/* header */}
      <div style={styles.header}>
        <div>
          <div style={styles.title}>Downline</div>
          <div style={styles.subtitle}>
            {teamCount === 0 ? "No members yet — tap your circle to add your first" : `${teamCount} member${teamCount === 1 ? "" : "s"} in your network`}
          </div>
        </div>
        <div style={styles.saveChip}>
          {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : saveState === "error" ? "Save failed" : ""}
        </div>
      </div>

      {/* chart */}
      <div
        ref={containerRef}
        style={styles.canvas}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <svg width="100%" height="100%" style={{ display: "block", touchAction: "none" }}>
          <g transform={`translate(${transform.x},${transform.y}) scale(${transform.k})`}>
            {/* links */}
            {Object.values(data.nodes).map((n) =>
              n.children.map((cid) => {
                const p1 = layout.positions[n.id];
                const p2 = layout.positions[cid];
                if (!p1 || !p2) return null;
                const midY = (p1.y + p2.y) / 2;
                return (
                  <path
                    key={`${n.id}-${cid}`}
                    d={`M ${p1.x} ${p1.y + R} C ${p1.x} ${midY}, ${p2.x} ${midY}, ${p2.x} ${p2.y - R}`}
                    fill="none"
                    stroke={COLORS.line}
                    strokeWidth={1.6}
                  />
                );
              })
            )}
            {/* nodes */}
            {Object.values(data.nodes).map((n) => {
              const p = layout.positions[n.id];
              if (!p) return null;
              const isSel = n.id === selectedId;
              const isRoot = n.id === data.rootId;
              const status = STATUS[n.progress] || STATUS.New;
              const initials = n.name
                .split(/\s+/)
                .map((w) => w[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();
              return (
                <g
                  key={n.id}
                  transform={`translate(${p.x},${p.y})`}
                  style={{ cursor: "pointer" }}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setSelectedId(n.id);
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(n.id);
                  }}
                >
                  {isSel && <circle r={R + 7} fill="none" stroke={COLORS.accent} strokeWidth={1.4} strokeDasharray="3 4" />}
                  <circle r={R} fill={isRoot ? COLORS.ink : COLORS.paper} stroke={isRoot ? COLORS.ink : status.color} strokeWidth={2.4} />
                  <text
                    textAnchor="middle"
                    dy="0.35em"
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: 15,
                      fontWeight: 700,
                      fill: isRoot ? "#F4F3EE" : COLORS.ink,
                      userSelect: "none",
                    }}
                  >
                    {initials || "?"}
                  </text>
                  <text
                    y={R + 18}
                    textAnchor="middle"
                    style={{
                      fontFamily: "system-ui, -apple-system, sans-serif",
                      fontSize: 12.5,
                      fontWeight: 600,
                      fill: COLORS.ink,
                      userSelect: "none",
                    }}
                  >
                    {n.name.length > 16 ? n.name.slice(0, 15) + "…" : n.name}
                  </text>
                  {!isRoot && (
                    <text
                      y={R + 33}
                      textAnchor="middle"
                      style={{
                        fontFamily: "system-ui, -apple-system, sans-serif",
                        fontSize: 10.5,
                        fill: status.color,
                        fontWeight: 600,
                        userSelect: "none",
                        letterSpacing: 0.3,
                      }}
                    >
                      {status.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* zoom controls */}
        <div
          style={styles.zoomBox}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          <button style={styles.zoomBtn} onClick={() => zoomButtons(1)} aria-label="Zoom in">+</button>
          <button style={styles.zoomBtn} onClick={() => zoomButtons(-1)} aria-label="Zoom out">−</button>
          <button style={{ ...styles.zoomBtn, fontSize: 12 }} onClick={fitView} aria-label="Fit chart to screen">Fit</button>
        </div>

        {/* selection toolbar */}
        {selected && (
          <div
            style={styles.toolbar}
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <div style={styles.toolbarName}>{selected.name}</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button style={styles.btnPrimary} onClick={() => setAddingUnder(selected.id)}>
                + Add member
              </button>
              <button style={styles.btn} onClick={() => setProfileId(selected.id)}>
                Open profile
              </button>
              <button style={styles.btn} onClick={() => setRenaming(selected.id)}>
                Rename
              </button>
              {selected.id !== data.rootId && (
                <button
                  style={{ ...styles.btn, color: "#A05252", borderColor: "#D8B8B8" }}
                  onClick={() => {
                    if (window.confirm(`Remove ${selected.name} and everyone under them?`)) deleteMember(selected.id);
                  }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* add / rename modals */}
      {addingUnder && (
        <NameModal
          title={`Add member under ${data.nodes[addingUnder].name}`}
          confirmLabel="Add member"
          onCancel={() => setAddingUnder(null)}
          onConfirm={(name) => {
            addMember(addingUnder, name);
            setAddingUnder(null);
          }}
        />
      )}
      {renaming && (
        <NameModal
          title={`Rename ${data.nodes[renaming].name}`}
          confirmLabel="Save name"
          initial={data.nodes[renaming].name}
          onCancel={() => setRenaming(null)}
          onConfirm={(name) => {
            renameMember(renaming, name);
            setRenaming(null);
          }}
        />
      )}
    </div>
  );
}

/* ======================== PROFILE PAGE ======================== */
function ProfilePage({ member, parent, isRoot, onBack, onUpdate, onDelete, saveState }) {
  const [note, setNote] = useState("");
  const status = STATUS[member.progress] || STATUS.New;

  const addEntry = () => {
    if (!note.trim()) return;
    const entry = { id: newId(), date: new Date().toISOString().slice(0, 10), text: note.trim() };
    onUpdate({ tracking: [entry, ...member.tracking] });
    setNote("");
  };

  const removeEntry = (id) => {
    onUpdate({ tracking: member.tracking.filter((t) => t.id !== id) });
  };

  return (
    <div style={{ ...styles.page, overflowY: "auto" }}>
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "18px 18px 60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button style={styles.btn} onClick={onBack}>← Back to chart</button>
          <div style={styles.saveChip}>
            {saveState === "saving" ? "Saving…" : saveState === "saved" ? "Saved" : ""}
          </div>
        </div>

        <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: "50%",
              background: isRoot ? COLORS.ink : COLORS.paper,
              border: `2.5px solid ${isRoot ? COLORS.ink : status.color}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "Georgia, serif",
              fontWeight: 700,
              fontSize: 20,
              color: isRoot ? COLORS.canvas : COLORS.ink,
              flexShrink: 0,
            }}
          >
            {member.name.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
          </div>
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 700, color: COLORS.ink }}>
              {member.name}
            </div>
            <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 2 }}>
              {isRoot ? "You — top of the network" : parent ? `Under ${parent.name} · joined ${member.joined}` : `Joined ${member.joined}`}
            </div>
          </div>
        </div>

        {/* progress */}
        <Section label="Progress">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {Object.entries(STATUS).map(([key, s]) => {
              const active = member.progress === key;
              return (
                <button
                  key={key}
                  onClick={() => onUpdate({ progress: key })}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 20,
                    border: `1.6px solid ${active ? s.color : COLORS.soft}`,
                    background: active ? s.color : COLORS.paper,
                    color: active ? "#fff" : COLORS.ink,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "system-ui, sans-serif",
                  }}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </Section>

        <Section label="Current issue">
          <textarea
            style={styles.textarea}
            rows={3}
            placeholder="What is holding this member back right now?"
            value={member.currentIssue}
            onChange={(e) => onUpdate({ currentIssue: e.target.value })}
          />
        </Section>

        <Section label="Proposed solution">
          <textarea
            style={styles.textarea}
            rows={3}
            placeholder="What is the plan to fix it?"
            value={member.proposedSolution}
            onChange={(e) => onUpdate({ proposedSolution: e.target.value })}
          />
        </Section>

        <Section label="Tracking">
          <div style={{ display: "flex", gap: 8 }}>
            <input
              style={{ ...styles.textarea, flex: 1, resize: "none" }}
              placeholder="Add an update — call made, training done, result…"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addEntry()}
            />
            <button style={styles.btnPrimary} onClick={addEntry}>Add</button>
          </div>
          <div style={{ marginTop: 14 }}>
            {member.tracking.length === 0 && (
              <div style={{ fontSize: 13, color: COLORS.muted }}>
                No updates yet. Each entry is dated automatically.
              </div>
            )}
            {member.tracking.map((t) => (
              <div
                key={t.id}
                style={{
                  display: "flex",
                  gap: 12,
                  padding: "10px 0",
                  borderBottom: `1px solid ${COLORS.soft}`,
                  alignItems: "flex-start",
                }}
              >
                <div style={{ fontSize: 12, color: COLORS.muted, whiteSpace: "nowrap", paddingTop: 2, fontWeight: 600 }}>
                  {t.date}
                </div>
                <div style={{ flex: 1, fontSize: 14, color: COLORS.ink, lineHeight: 1.5 }}>{t.text}</div>
                <button
                  onClick={() => removeEntry(t.id)}
                  style={{ ...styles.btn, padding: "2px 9px", fontSize: 12 }}
                  aria-label="Delete entry"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </Section>

        {!isRoot && (
          <div style={{ marginTop: 40 }}>
            <button style={{ ...styles.btn, color: "#A05252", borderColor: "#D8B8B8" }} onClick={onDelete}>
              Remove {member.name} from the network
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ label, children }) {
  return (
    <div style={{ marginTop: 30 }}>
      <div
        style={{
          fontSize: 11.5,
          letterSpacing: 1.4,
          textTransform: "uppercase",
          fontWeight: 700,
          color: COLORS.muted,
          marginBottom: 10,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {label}
      </div>
      {children}
    </div>
  );
}

/* ======================== NAME MODAL ======================== */
function NameModal({ title, confirmLabel, initial = "", onConfirm, onCancel }) {
  const [name, setName] = useState(initial);
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, []);
  return (
    <div style={styles.modalBackdrop} onClick={onCancel}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 700, color: COLORS.ink }}>{title}</div>
        <input
          ref={inputRef}
          style={{ ...styles.textarea, marginTop: 14 }}
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && name.trim() && onConfirm(name)}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 16, justifyContent: "flex-end" }}>
          <button style={styles.btn} onClick={onCancel}>Cancel</button>
          <button
            style={{ ...styles.btnPrimary, opacity: name.trim() ? 1 : 0.5 }}
            disabled={!name.trim()}
            onClick={() => onConfirm(name)}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ======================== STYLES ======================== */
const styles = {
  page: {
    position: "fixed",
    inset: 0,
    background: COLORS.canvas,
    display: "flex",
    flexDirection: "column",
    fontFamily: "system-ui, -apple-system, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: "16px 20px 10px",
  },
  title: {
    fontFamily: "Georgia, serif",
    fontSize: 24,
    fontWeight: 700,
    color: COLORS.ink,
    letterSpacing: -0.3,
  },
  subtitle: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  saveChip: { fontSize: 12, color: COLORS.muted, fontWeight: 600, paddingTop: 6, minWidth: 60, textAlign: "right" },
  canvas: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    cursor: "grab",
    borderTop: `1px solid ${COLORS.soft}`,
  },
  zoomBox: {
    position: "absolute",
    right: 14,
    bottom: 16,
    display: "flex",
    flexDirection: "column",
    gap: 6,
  },
  zoomBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    border: `1px solid ${COLORS.soft}`,
    background: COLORS.paper,
    color: COLORS.ink,
    fontSize: 20,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(28,43,39,0.08)",
  },
  toolbar: {
    position: "absolute",
    left: 14,
    right: 14,
    top: 12,
    background: COLORS.paper,
    border: `1px solid ${COLORS.soft}`,
    borderRadius: 14,
    padding: "12px 14px",
    boxShadow: "0 6px 20px rgba(28,43,39,0.12)",
    maxWidth: 480,
  },
  toolbarName: {
    fontFamily: "Georgia, serif",
    fontWeight: 700,
    fontSize: 16,
    color: COLORS.ink,
    marginBottom: 9,
  },
  btn: {
    padding: "8px 14px",
    borderRadius: 9,
    border: `1px solid ${COLORS.soft}`,
    background: COLORS.paper,
    color: COLORS.ink,
    fontSize: 13.5,
    fontWeight: 600,
    cursor: "pointer",
  },
  btnPrimary: {
    padding: "8px 16px",
    borderRadius: 9,
    border: `1px solid ${COLORS.accent}`,
    background: COLORS.accent,
    color: "#fff",
    fontSize: 13.5,
    fontWeight: 600,
    cursor: "pointer",
  },
  textarea: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 12px",
    borderRadius: 10,
    border: `1px solid ${COLORS.soft}`,
    background: COLORS.paper,
    color: COLORS.ink,
    fontSize: 14,
    fontFamily: "system-ui, -apple-system, sans-serif",
    lineHeight: 1.5,
    outline: "none",
    resize: "vertical",
  },
  modalBackdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(28,43,39,0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    zIndex: 50,
  },
  modal: {
    background: COLORS.canvas,
    borderRadius: 16,
    padding: 22,
    width: "100%",
    maxWidth: 400,
    boxShadow: "0 20px 50px rgba(28,43,39,0.25)",
  },
};
