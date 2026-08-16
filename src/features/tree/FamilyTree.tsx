import { useEffect, useRef, useState } from "react";
import { useFamilyStore } from "../../store";
import type { Person } from "../../types";
import { copyFor, fillCopy, genderMark, initials, nodeNameLines, sortPeopleByBirth, textFor, titleTier, years, type Language } from "../shared/presentation";
export function FamilyTree({
  onHome,
  onBack,
  canBack,
  onSelectPerson,
  treeVisitKey,
}: {
  onHome: () => void;
  onBack: () => void;
  canBack: boolean;
  onSelectPerson: (id: string) => void;
  treeVisitKey: number;
}) {
  const treeShellRef = useRef<HTMLElement | null>(null);
  const people = useFamilyStore((state) => state.people);
  const selectedId = useFamilyStore((state) => state.selectedId);
  const activeTag = useFamilyStore((state) => state.activeTag);
  const activeGender = useFamilyStore((state) => state.activeGender);
  const searchQuery = useFamilyStore((state) => state.searchQuery);
  const language = useFamilyStore((state) => state.language);
  const zoom = useFamilyStore((state) => state.zoom);
  const zoomIn = useFamilyStore((state) => state.zoomIn);
  const zoomOut = useFamilyStore((state) => state.zoomOut);
  const resetZoom = useFamilyStore((state) => state.resetZoom);
  const setZoom = useFamilyStore((state) => state.setZoom);
  const [showParents, setShowParents] = useState(true);
  const [showSpouses, setShowSpouses] = useState(true);
  const [showChildren, setShowChildren] = useState(true);
  const [hiddenChildren, setHiddenChildren] = useState<Record<string, boolean>>({});
  const [generationDepth, setGenerationDepth] = useState(3);
  const [extraAncestorDepth, setExtraAncestorDepth] = useState(0);
  const [expandedDescendants, setExpandedDescendants] = useState<Record<string, boolean>>({});
  const [collapsedDescendants, setCollapsedDescendants] = useState<Record<string, boolean>>({});
  const [expandedSpouses, setExpandedSpouses] = useState<Record<string, boolean>>({});
  const [expandedSpouseAncestors, setExpandedSpouseAncestors] = useState<Record<string, number>>({});
  const [activeSpouseIndex, setActiveSpouseIndex] = useState(0);
  const t = copyFor(language);
  const nameOf = (person: Person) => textFor(person, language).displayName;
  const byId = new Map(people.map((person) => [person.id, person]));
  const center = byId.get(selectedId) ?? byId.get("11A260814K001") ?? people[0];
  function ancestorFor(person: Person) {
    const father = byId.get(person.relationships.fatherId);
    const mother = byId.get(person.relationships.motherId);
    // The top control follows one stable route: father first, then mother only
    // when the father's record is absent. Maternal transitions stay explicit
    // through the spouse button on the relevant card.
    return father ?? mother;
  }
  const radius = Math.floor(generationDepth / 2);
  const ancestorRadius = radius + extraAncestorDepth;
  const ancestorNodes: Array<{ person: Person; x: number; y: number; depth: number }> = [];
  let ancestorCursor = center;
  const card = { width: 178, height: 108 };
  const generationGap = 210;
  const horizontalPadding = 180;
  const siblingGap = card.width + 68;
  const spouses = [...center.relationships.partnerIds, ...center.relationships.spouseIds]
    .map((id) => byId.get(id))
    .filter((person): person is Person => Boolean(person));
  function relationshipPartnerIds(owner: Person, child?: Person) {
    const relationshipIds = [...owner.relationships.partnerIds, ...owner.relationships.spouseIds];
    if (!child) return relationshipIds;

    // On an ancestor chain, show only the other recorded parent of the child below.
    const parentIds = [child.relationships.fatherId, child.relationships.motherId]
      .filter((id) => id && id !== owner.id);
    const matchingIds = relationshipIds.filter((id) => parentIds.includes(id));
    return matchingIds.length > 0 ? matchingIds : relationshipIds;
  }
  const normalizedSpouseIndex = spouses.length > 0 ? Math.min(activeSpouseIndex, spouses.length - 1) : 0;
  const activeSpouse = spouses.length > 0 ? spouses[normalizedSpouseIndex] : undefined;
  const activeSpouseId = showSpouses ? activeSpouse?.id ?? "" : "";
  const visibleCenterChildIds = sortPeopleByBirth(
    center.relationships.childIds
      .map((id) => byId.get(id))
      .filter((person): person is Person => Boolean(person))
      .filter((person) => {
        if (hiddenChildren[person.id]) return false;
        if (!activeSpouseId) return true;
        return person.relationships.fatherId === activeSpouseId || person.relationships.motherId === activeSpouseId;
      })
      .map((person) => ({ person })),
  ).map(({ person }) => person.id);
  const visibleCenterChildren = visibleCenterChildIds.length;
  const neededChildWidth = Math.max(0, (visibleCenterChildren - 1) * siblingGap + card.width + horizontalPadding * 2);
  const expandedSpouseAncestorDepth = Object.values(expandedSpouseAncestors)
    .reduce((total, depth) => total + depth, 0);
  const maxSpouseAncestorDepth = Object.values(expandedSpouseAncestors)
    .reduce((max, depth) => Math.max(max, depth), 0);
  const hasExpandedRelationshipBranch = Object.values(expandedSpouses).some(Boolean)
    || maxSpouseAncestorDepth > 0;
  // Relationship branches can extend several cards to the right of the
  // focused chain. Keep those cards inside the SVG so the shell can scroll to
  // them instead of clipping them at the viewBox edge.
  const relationshipWidth = hasExpandedRelationshipBranch
    ? (ancestorRadius + maxSpouseAncestorDepth + 4) * 250 + card.width + horizontalPadding * 2
    : 0;
  const width = Math.max(1280, neededChildWidth, relationshipWidth);
  // A spouse branch starts from an existing ancestor row, so its vertical
  // extent must include both the principal-chain depth and its own depth.
  const spouseAncestorRadius = expandedSpouseAncestorDepth > 0
    ? ancestorRadius + expandedSpouseAncestorDepth
    : 0;
  const centerPoint = { x: width / 2, y: 130 + Math.max(ancestorRadius, spouseAncestorRadius + 1) * generationGap };
  for (let depth = 1; depth <= ancestorRadius; depth += 1) {
    const ancestor = ancestorFor(ancestorCursor);
    if (!ancestor) break;
    const extraDepth = Math.max(0, depth - radius);
    // Keep an unexpanded ancestor chain vertically aligned. Only spread an
    // extra ancestor sideways when its lower node is showing a spouse branch.
    const sideOffset = extraDepth > 0 && expandedSpouses[ancestorCursor.id]
      ? (extraDepth % 2 === 0 ? 250 : -250)
      : 0;
    ancestorNodes.push({ person: ancestor, x: centerPoint.x + sideOffset, y: centerPoint.y - depth * generationGap, depth });
    ancestorCursor = ancestor;
  }
  const topAncestor = ancestorNodes[ancestorNodes.length - 1];
  const topAncestorParent = topAncestor ? ancestorFor(topAncestor.person) : undefined;
  const descendantRows: Array<Array<{ person: Person; x: number; y: number; parentId: string }>> = [];
  let previousGeneration = [{ person: center, x: centerPoint.x }];
  for (let depth = 1; depth <= 8; depth += 1) {
    const rowPeople = previousGeneration.flatMap((parent) => {
      const isManuallyCollapsed = collapsedDescendants[parent.person.id];
      const canShowChildren = !isManuallyCollapsed && (depth <= radius || expandedDescendants[parent.person.id]);
      if (!canShowChildren) return [];
      return sortPeopleByBirth((parent.person.id === center.id ? visibleCenterChildIds : parent.person.relationships.childIds)
        .map((id) => byId.get(id))
        .filter((person): person is Person => Boolean(person))
        .filter((person) => !hiddenChildren[person.id])
        .map((person) => ({ person, parentId: parent.person.id })));
    });
    if (rowPeople.length === 0) break;
    const spacing = Math.max(card.width + 44, siblingGap - depth * 18);
    const y = centerPoint.y + depth * generationGap;
    const row = rowPeople.map((item, index) => ({
      ...item,
      x: centerPoint.x - ((rowPeople.length - 1) * spacing) / 2 + index * spacing,
      y,
    }));
    descendantRows.push(row);
    previousGeneration = row.map(({ person, x }) => ({ person, x }));
  }
  const nodePosition = new Map<string, { x: number; y: number }>([[center.id, centerPoint]]);
  ancestorNodes.forEach((node) => nodePosition.set(node.person.id, { x: node.x, y: node.y }));
  descendantRows.flat().forEach((node) => nodePosition.set(node.person.id, { x: node.x, y: node.y }));
  const renderedChildParentIds = new Set(descendantRows.flat().map((node) => node.parentId));
  const children = visibleCenterChildIds.map((id) => byId.get(id)).filter((person): person is Person => Boolean(person));
  const renderedRows = Math.max(radius, descendantRows.length);
  const height = centerPoint.y + renderedRows * generationGap + 280;
  const spousePoints = activeSpouse ? [{ person: activeSpouse, x: centerPoint.x + 250, y: centerPoint.y }] : [];
  const childSpineY = centerPoint.y + 122;
  const ancestorSpouseNodes = showParents
      ? ancestorNodes.flatMap((node, index) => {
        const childBelow = index === 0 ? center : ancestorNodes[index - 1].person;
        return expandedSpouses[node.person.id]
          ? relationshipPartnerIds(node.person, childBelow)
              .map((id) => byId.get(id))
              .filter((person): person is Person => Boolean(person))
              .map((spouse, spouseIndex) => ({ spouse, owner: node, x: node.x + 250, y: node.y + spouseIndex * 118 }))
          : [];
      })
    : [];
  const spouseAncestorNodes = ancestorSpouseNodes.flatMap(({ spouse, x, y }) => {
    const depthLimit = expandedSpouseAncestors[spouse.id] ?? 0;
    const nodes: Array<{ person: Person; x: number; y: number; depth: number; spouseId: string }> = [];
    let cursor = spouse;
    for (let depth = 1; depth <= depthLimit; depth += 1) {
      const ancestor = ancestorFor(cursor);
      if (!ancestor) break;
      nodes.push({ person: ancestor, x, y: y - depth * generationGap, depth, spouseId: spouse.id });
      cursor = ancestor;
    }
    return nodes;
  });
  const spouseBranchSpouseNodes = spouseAncestorNodes.flatMap((node) => {
    if (!expandedSpouses[node.person.id]) return [];
    const lowerPerson = node.depth === 1
      ? ancestorSpouseNodes.find((candidate) => candidate.spouse.id === node.spouseId)?.spouse
      : spouseAncestorNodes.find((candidate) => candidate.spouseId === node.spouseId && candidate.depth === node.depth - 1)?.person;
    return relationshipPartnerIds(node.person, lowerPerson)
      .map((id) => byId.get(id))
      .filter((person): person is Person => Boolean(person))
      .map((spouse, spouseIndex) => ({
        spouse,
        owner: node,
        x: node.x + 250,
        y: node.y + spouseIndex * 118,
      }));
  });
  const nestedSpouseAncestorNodes = spouseBranchSpouseNodes.flatMap(({ spouse, x, y }) => {
    const depthLimit = expandedSpouseAncestors[spouse.id] ?? 0;
    const nodes: Array<{ person: Person; x: number; y: number; depth: number; spouseId: string }> = [];
    let cursor = spouse;
    for (let depth = 1; depth <= depthLimit; depth += 1) {
      const ancestor = ancestorFor(cursor);
      if (!ancestor) break;
      nodes.push({ person: ancestor, x, y: y - depth * generationGap, depth, spouseId: spouse.id });
      cursor = ancestor;
    }
    return nodes;
  });
  // Relationship toggles must keep working on every visible ancestor card,
  // including cards that were reached through another spouse branch.
  const nestedSpouseBranchSpouseNodes = nestedSpouseAncestorNodes.flatMap((node) => {
    if (!expandedSpouses[node.person.id]) return [];
    const lowerPerson = node.depth === 1
      ? spouseBranchSpouseNodes.find((candidate) => candidate.spouse.id === node.spouseId)?.spouse
      : nestedSpouseAncestorNodes.find((candidate) => candidate.spouseId === node.spouseId && candidate.depth === node.depth - 1)?.person;
    return relationshipPartnerIds(node.person, lowerPerson)
      .map((id) => byId.get(id))
      .filter((person): person is Person => Boolean(person))
      .map((spouse, spouseIndex) => ({
        spouse,
        owner: node,
        x: node.x + 250,
        y: node.y + spouseIndex * 118,
      }));
  });
  const deepSpouseAncestorNodes = nestedSpouseBranchSpouseNodes.flatMap(({ spouse, x, y }) => {
    const depthLimit = expandedSpouseAncestors[spouse.id] ?? 0;
    const nodes: Array<{ person: Person; x: number; y: number; depth: number; spouseId: string }> = [];
    let cursor = spouse;
    for (let depth = 1; depth <= depthLimit; depth += 1) {
      const ancestor = ancestorFor(cursor);
      if (!ancestor) break;
      nodes.push({ person: ancestor, x, y: y - depth * generationGap, depth, spouseId: spouse.id });
      cursor = ancestor;
    }
    return nodes;
  });
  const allSpouseAncestorNodes = [
    ...spouseAncestorNodes,
    ...nestedSpouseAncestorNodes,
    ...deepSpouseAncestorNodes,
  ];
  const relatedSpouseNodes = [
    ...ancestorSpouseNodes,
    ...spouseBranchSpouseNodes,
    ...nestedSpouseBranchSpouseNodes,
  ];

  function centerTree(zoomOverride?: number) {
    const shell = treeShellRef.current;
    if (!shell) return;
    const scale = zoomOverride ?? zoom;
    const targetLeft = Math.max(0, centerPoint.x * scale - shell.clientWidth / 2);
    const targetTop = Math.max(0, centerPoint.y * scale - shell.clientHeight / 2);
    shell.scrollTo({ left: targetLeft, top: targetTop, behavior: "smooth" });
  }

  // Fit the canvas to the available viewport width when entering the tree
  // page. Cards, connectors, and controls all scale together through the SVG
  // viewBox, so this zoom never distorts card proportions.
  function fitZoomFor(shellWidth: number) {
    return Math.min(1, Math.max(0.5, (shellWidth - 32) / width));
  }

  // Center and fit only when entering the tree page. Expanding a branch must
  // preserve the user's current viewport; refocusing is an explicit toolbar
  // action. The fit clamps to [0.5, 1]: never upscaled beyond 100% on large
  // screens, never shrunk below 50% on narrow ones.
  useEffect(() => {
    const shell = treeShellRef.current;
    if (!shell) return;
    const fit = fitZoomFor(shell.clientWidth);
    setZoom(fit);
    centerTree(fit);
    // Deliberately exclude layout and selection changes: branch expansion and
    // person selection should never move the viewport without user intent.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [treeVisitKey]);

  useEffect(() => {
    setActiveSpouseIndex(Math.max(0, spouses.length - 1));
  }, [selectedId, spouses.length]);

  function BranchToggle({ x, y, expanded, onClick, label, disabled = false }: { x: number; y: number; expanded: boolean; onClick: () => void; label: string; disabled?: boolean }) {
    return (
      <foreignObject x={x - 13} y={y - 13} width="26" height="26">
        <button
          type="button"
          className="branch-toggle"
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
            onClick();
          }}
          aria-label={label}
          title={disabled ? t.collapseActiveAncestorFirst : label}
        >
          {expanded ? "-" : "+"}
        </button>
      </foreignObject>
    );
  }

  function SpouseCycleButton({ x, y, direction }: { x: number; y: number; direction: "previous" | "next" }) {
    if (spouses.length < 2) return null;
    const symbol = direction === "previous" ? "←" : "→";
    return (
      <foreignObject x={x - 14} y={y - 14} width="28" height="28">
        <button
          type="button"
          className="spouse-cycle-button"
          onClick={(event) => {
            event.stopPropagation();
            setActiveSpouseIndex((index) => {
              const normalized = Math.min(index, spouses.length - 1);
              return direction === "previous"
                ? Math.max(0, normalized - 1)
                : Math.min(spouses.length - 1, normalized + 1);
            });
          }}
          aria-label={direction === "previous" ? t.previousSpouse : t.nextSpouse}
        >
          {symbol}
        </button>
      </foreignObject>
    );
  }

  function PersonNode({ person, x, y }: { person: Person; x: number; y: number }) {
    const label = textFor(person, language);
    const nameLines = nodeNameLines(label.displayName);
    const nameStartY = nameLines.length > 1 ? 56 : 62;
    const titleY = nameLines.length > 1 ? 85 : 82;
    const yearsY = nameLines.length > 1 ? 101 : 99;
    const centerX = card.width / 2;
    const isSelected = selectedId === person.id;
    const query = searchQuery.trim().toLowerCase();
    const matchesTag = activeTag === "all" || person.tags.includes(activeTag);
    const matchesGender = activeGender === "all" || person.gender === activeGender;
    const searchable = `${person.displayName} ${person.fullName} ${label.displayName} ${label.fullName} ${person.alsoKnownAs.join(" ")} ${person.nicknameCn ?? ""} ${person.primaryTitleCn ?? ""}`.toLowerCase();
    const matchesSearch = !query || searchable.includes(query);
    const isDimmed = !matchesTag || !matchesGender || !matchesSearch;
    const tier = titleTier(person);

    return (
      <g
        className={`person-node tier-${tier} ${person.tags.includes("illegitimate") ? "illegitimate" : ""} ${isSelected ? "selected" : ""} ${isDimmed ? "dimmed" : ""}`}
        transform={`translate(${x - card.width / 2},${y - card.height / 2})`}
        onClick={() => {
          onSelectPerson(person.id);
          setShowParents(true);
          setShowSpouses(true);
          setShowChildren(true);
          setHiddenChildren({});
          setExtraAncestorDepth(0);
          setExpandedDescendants({});
          setCollapsedDescendants({});
          setExpandedSpouses({});
          setExpandedSpouseAncestors({});
        }}
        tabIndex={0}
        role="button"
        aria-label={`${t.select} ${label.fullName}`}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") onSelectPerson(person.id);
        }}
      >
        {isSelected && <rect className="selection-glow" width={card.width} height={card.height} rx="8" />}
        <rect width={card.width} height={card.height} rx="8" />
        <text className={`gender-mark ${person.gender}`} x={card.width - 15} y="20">{genderMark(person)}</text>
        <circle cx={centerX} cy="24" r="21" />
        <text className="avatar-text" x={centerX} y="30">{initials(person, language)}</text>
        <text className="node-name" x={centerX} y={nameStartY}>
          {nameLines.map((line, index) => <tspan key={line} x={centerX} dy={index === 0 ? 0 : 14}>{line}</tspan>)}
        </text>
        <text className="node-title" x={centerX} y={titleY}>{label.primaryTitle}</text>
        <text className="node-years" x={centerX} y={yearsY}>{years(person)}</text>
        {person.tags.includes("illegitimate") && <text className="legitimacy-mark" x="14" y="20">{language === "cn" ? "私" : "B"}</text>}
      </g>
    );
  }

  function togglePersonDescendants(person: Person) {
    const hasRenderedChildren = renderedChildParentIds.has(person.id);
    setExpandedDescendants((current) => {
      const next = { ...current };
      if (hasRenderedChildren) delete next[person.id];
      else next[person.id] = true;
      return next;
    });
    setCollapsedDescendants((current) => {
      const next = { ...current };
      if (hasRenderedChildren) next[person.id] = true;
      else delete next[person.id];
      return next;
    });
  }

  function togglePersonSpouses(person: Person) {
    setExpandedSpouses((current) => {
      const next = { ...current };
      if (next[person.id]) delete next[person.id];
      else next[person.id] = true;
      return next;
    });
  }

  function childAnchorFor(parentId: string) {
    const bottomOffset = card.height / 2 + 14;
    if (parentId === center.id && showSpouses && spousePoints.length > 0) {
      return { x: (centerPoint.x + spousePoints[0].x) / 2, y: centerPoint.y - bottomOffset };
    }
    return nodePosition.get(parentId) ?? centerPoint;
  }

  function isFormerMarriage(person: Person) {
    const ids = new Set([center.id, person.id]);
    return ids.has("12E260814A011") && ids.has("12L260814F024");
  }

  function isNonMaritalPartner(person: Person) {
    return center.relationships.partnerIds.includes(person.id) || person.relationships.partnerIds.includes(center.id);
  }

  function handleTreeWheel(event: React.WheelEvent<HTMLElement>) {
    const shell = treeShellRef.current;
    if (!shell) return;
    const verticalDelta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : 0;
    if (verticalDelta === 0 || event.shiftKey) return;
    const maxScrollTop = shell.scrollHeight - shell.clientHeight;
    if (maxScrollTop <= 0) return;
    const nextScrollTop = Math.min(maxScrollTop, Math.max(0, shell.scrollTop + verticalDelta));
    if (nextScrollTop === shell.scrollTop) return;
    event.preventDefault();
    shell.scrollTop = nextScrollTop;
  }

  return (
    <section ref={treeShellRef} className="tree-shell" aria-label={t.ariaTree} onWheel={handleTreeWheel}>
      <div className="zoom-controls" aria-label={t.zoomControls}>
        <button type="button" onClick={zoomOut} aria-label={t.zoomOut}>-</button>
        <button type="button" onClick={resetZoom} aria-label={t.resetZoom}>{Math.round(zoom * 100)}%</button>
        <button type="button" onClick={zoomIn} aria-label={t.zoomIn}>+</button>
        <button
          type="button"
          className="tree-focus-button"
          onClick={() => centerTree()}
          aria-label={t.centerFocus}
          title={t.centerFocus}
        >
          ◎
        </button>
      </div>
      <div className="tree-nav-controls" aria-label={t.treeNavigation}>
        <button type="button" onClick={onBack} disabled={!canBack}>{t.back}</button>
        <button type="button" onClick={onHome}>{t.home}</button>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" style={{ width: `${width * zoom}px`, height: `${height * zoom}px` }}>
        <g>
          <circle className="union-dot" cx={centerPoint.x} cy="44" r="7" />
          <text className="union-label" x={centerPoint.x} y="68">{t.rootLabel}</text>
          {ancestorNodes.length > 0 && <BranchToggle x={centerPoint.x} y={centerPoint.y - card.height / 2 - 34} expanded={showParents} onClick={() => setShowParents(!showParents)} label={t.toggleParents} />}
          {showParents && ancestorNodes.map(({ person, x, y, depth }) => {
            const lower = depth === 1 ? centerPoint : ancestorNodes[depth - 2];
            const lowerPerson = depth === 1 ? center : ancestorNodes[depth - 2].person;
            const otherParent = ancestorSpouseNodes.find((node) =>
              node.owner.person.id === person.id
              && [lowerPerson.relationships.fatherId, lowerPerson.relationships.motherId].includes(node.spouse.id),
            );
            const childAnchor = otherParent
              ? { x: (x + otherParent.x) / 2, y }
              : { x, y: y + card.height / 2 };
            const childTopY = lower.y - card.height / 2;
            const branchY = childTopY - 32;
            const linkPath = otherParent
              ? `M${childAnchor.x},${childAnchor.y} V${branchY} H${lower.x} V${childTopY}`
              : `M${childAnchor.x},${childAnchor.y} V${childTopY}`;
            return (
            <g key={person.id}>
              <path className="tree-link" d={linkPath} />
              <PersonNode person={person} x={x} y={y} />
              {relationshipPartnerIds(person).length > 0 && (
                <BranchToggle
                  x={x + card.width / 2 - 12}
                  y={y + card.height / 2 - 12}
                  expanded={Boolean(expandedSpouses[person.id])}
                  onClick={() => togglePersonSpouses(person)}
                  label={fillCopy(t.toggleRelationshipsFor, { name: nameOf(person) })}
                />
              )}
              {depth < ancestorNodes.length && (
                <BranchToggle
                  x={x}
                  y={y - card.height / 2 - 18}
                  expanded
                  onClick={() => setExtraAncestorDepth(Math.max(0, depth - radius))}
                  label={fillCopy(t.collapseAncestorsAbove, { name: nameOf(person) })}
                />
              )}
            </g>
            );
          })}
          {allSpouseAncestorNodes.map(({ person, x, y, depth, spouseId }) => {
            const lower = depth === 1
              ? relatedSpouseNodes.find((node) => node.spouse.id === spouseId)
              : allSpouseAncestorNodes.find((node) => node.spouseId === spouseId && node.depth === depth - 1);
            if (!lower) return null;
            const lowerPerson = "spouse" in lower ? lower.spouse : lower.person;
            const otherParent = spouseBranchSpouseNodes.find((node) =>
              node.owner.person.id === person.id
              && [lowerPerson.relationships.fatherId, lowerPerson.relationships.motherId].includes(node.spouse.id),
            );
            const childTopY = lower.y - card.height / 2;
            const branchY = childTopY - 32;
            const linkPath = otherParent
              ? `M${(x + otherParent.x) / 2},${y} V${branchY} H${lower.x} V${childTopY}`
              : `M${x},${y + card.height / 2} V${childTopY}`;
            return (
              <g key={`spouse-ancestor-${spouseId}-${person.id}`}>
                <path className="tree-link" d={linkPath} />
                <PersonNode person={person} x={x} y={y} />
                {relationshipPartnerIds(person).length > 0 && (
                  <BranchToggle
                    x={x + card.width / 2 - 12}
                    y={y + card.height / 2 - 12}
                    expanded={Boolean(expandedSpouses[person.id])}
                    onClick={() => togglePersonSpouses(person)}
                    label={fillCopy(t.toggleRelationshipsFor, { name: nameOf(person) })}
                  />
                )}
                {depth < (expandedSpouseAncestors[spouseId] ?? 0) && (
                  <BranchToggle
                    x={x}
                    y={y - card.height / 2 - 18}
                    expanded
                    onClick={() => setExpandedSpouseAncestors((current) => ({ ...current, [spouseId]: depth }))}
                    label={fillCopy(t.collapseAncestorsAbove, { name: nameOf(person) })}
                  />
                )}
              </g>
            );
          })}
          {relatedSpouseNodes.map(({ spouse, x, y }) => {
            const canExpand = Boolean(ancestorFor(spouse));
            if (!canExpand) return null;
            const depth = expandedSpouseAncestors[spouse.id] ?? 0;
            return (
              <BranchToggle
                key={`spouse-ancestor-toggle-${spouse.id}`}
                x={x}
                y={y - card.height / 2 - 18}
                expanded={depth > 0}
                onClick={() => setExpandedSpouseAncestors((current) => ({ ...current, [spouse.id]: depth > 0 ? 0 : 1 }))}
                label={fillCopy(t.extendAncestorsFrom, { name: nameOf(spouse) })}
              />
            );
          })}
          {relatedSpouseNodes.map(({ spouse }) => {
            const depth = expandedSpouseAncestors[spouse.id] ?? 0;
            if (depth === 0) return null;
            const branchNodes = allSpouseAncestorNodes.filter((node) => node.spouseId === spouse.id);
            const topNode = branchNodes[branchNodes.length - 1];
            if (!topNode || !ancestorFor(topNode.person)) return null;
            return (
              <BranchToggle
                key={`spouse-ancestor-more-${spouse.id}`}
                x={topNode.x}
                y={topNode.y - card.height / 2 - 18}
                expanded={false}
                onClick={() => setExpandedSpouseAncestors((current) => ({ ...current, [spouse.id]: depth + 1 }))}
                label={fillCopy(t.extendAncestorLineFrom, { name: nameOf(spouse) })}
              />
            );
          })}
          {showParents && topAncestorParent && (
            <BranchToggle
              x={topAncestor.x}
              y={topAncestor.y - card.height / 2 - 18}
              expanded={false}
              onClick={() => setExtraAncestorDepth((value) => value + 1)}
              label={t.extendAncestorLine}
            />
          )}
          {showParents && extraAncestorDepth > 0 && (
            <BranchToggle
              x={centerPoint.x + 36}
              y={centerPoint.y - card.height / 2 - 34}
              expanded
              onClick={() => setExtraAncestorDepth((value) => Math.max(0, value - 1))}
              label={t.collapseAncestorLine}
            />
          )}
          {showSpouses && spousePoints.map(({ person, x, y }) => (
            <g key={person.id}>
              <path className={`marriage-link ${isFormerMarriage(person) ? "former" : ""} ${isNonMaritalPartner(person) ? "partner" : ""}`} d={`M${centerPoint.x + card.width / 2},${centerPoint.y} H${x - card.width / 2}`} />
              {isFormerMarriage(person) && <text className="marriage-break" x={(centerPoint.x + x) / 2} y={centerPoint.y + 5}>x</text>}
              {isNonMaritalPartner(person) && <text className="partner-mark" x={(centerPoint.x + x) / 2} y={centerPoint.y + 5}>◇</text>}
              <text className="union-label" x={(centerPoint.x + x) / 2} y={centerPoint.y - 18}>{isFormerMarriage(person) ? t.divorced : isNonMaritalPartner(person) ? t.partner : t.unionLabel}</text>
              <PersonNode person={person} x={x} y={y} />
              {spouses.length === 2 ? (
                <SpouseCycleButton x={x + card.width / 2 + 16} y={y} direction={normalizedSpouseIndex === spouses.length - 1 ? "previous" : "next"} />
              ) : (
                <>
                  {normalizedSpouseIndex > 0 && <SpouseCycleButton x={x + card.width / 2 + 16} y={y - 18} direction="previous" />}
                  {normalizedSpouseIndex < spouses.length - 1 && <SpouseCycleButton x={x + card.width / 2 + 16} y={y + 18} direction="next" />}
                </>
              )}
            </g>
          ))}
          <PersonNode person={center} x={centerPoint.x} y={centerPoint.y} />
          {spouses.length > 0 && <BranchToggle x={centerPoint.x + card.width / 2 - 12} y={centerPoint.y + card.height / 2 - 12} expanded={showSpouses} onClick={() => setShowSpouses(!showSpouses)} label={t.toggleSpouses} />}
          {children.length > 0 && (
            <BranchToggle
              x={centerPoint.x - card.width / 2 + 10}
              y={centerPoint.y + card.height / 2 - 10}
              expanded={showChildren}
              onClick={() => {
                setShowChildren(!showChildren);
              }}
              label={t.toggleDescendants}
            />
          )}
          {relatedSpouseNodes.map(({ spouse, owner, x, y }) => (
            <g key={`${owner.person.id}-${spouse.id}`}>
              <path className={`marriage-link ${owner.person.relationships.partnerIds.includes(spouse.id) ? "partner" : ""}`} d={`M${owner.x + card.width / 2},${owner.y} H${x - card.width / 2}`} />
              {owner.person.relationships.partnerIds.includes(spouse.id) && <text className="partner-mark" x={(owner.x + x) / 2} y={owner.y + 5}>◇</text>}
              <text className="union-label" x={(owner.x + x) / 2} y={owner.y - 18}>{owner.person.relationships.partnerIds.includes(spouse.id) ? t.partner : t.unionLabel}</text>
              <PersonNode person={spouse} x={x} y={y} />
            </g>
          ))}
          {showChildren && descendantRows.flat().map(({ person, x, y, parentId }) => {
            const parent = childAnchorFor(parentId);
            const midY = parent.y + 132;
            return (
            <g key={person.id}>
              <path className="tree-link" d={`M${parent.x},${parent.y + card.height / 2 + 14} V${midY} H${x} V${y - card.height / 2}`} />
              <PersonNode person={person} x={x} y={y} />
              {parentId === center.id && (
                <BranchToggle
                  x={x}
                  y={y - card.height / 2 - 18}
                  expanded
                  onClick={() => setHiddenChildren((current) => ({ ...current, [person.id]: true }))}
                  label={fillCopy(t.hide, { name: nameOf(person) })}
                />
              )}
              {person.relationships.childIds.length > 0 && (
                <BranchToggle
                  x={x - card.width / 2 + 12}
                  y={y + card.height / 2 - 12}
                  expanded={renderedChildParentIds.has(person.id)}
                  onClick={() => togglePersonDescendants(person)}
                  label={fillCopy(t.extendDescendantsFrom, { name: nameOf(person) })}
                />
              )}
            </g>
            );
          })}
          {showChildren && center.relationships.childIds
            .map((id) => byId.get(id))
            .filter((person): person is Person => Boolean(person))
            .filter((person) => hiddenChildren[person.id])
            .map((person, index) => (
            <BranchToggle key={person.id} x={centerPoint.x + 42 + index * 34} y={childSpineY} expanded={false} onClick={() => setHiddenChildren((current) => ({ ...current, [person.id]: false }))} label={`${t.show} ${nameOf(person)}`} />
          ))}
        </g>
      </svg>
      <div className="generation-controls" aria-label={t.generationDepth}>
        <button
          type="button"
          onClick={() => {
            setGenerationDepth((value) => Math.max(3, value - 2));
            setExpandedDescendants({});
            setCollapsedDescendants({});
            setExpandedSpouses({});
            setExtraAncestorDepth(0);
          }}
        >
          -
        </button>
        <span>{generationDepth} {t.generationUnit}</span>
        <button
          type="button"
          onClick={() => {
            setGenerationDepth((value) => Math.min(7, value + 2));
            setExpandedDescendants({});
            setCollapsedDescendants({});
            setExpandedSpouses({});
            setExtraAncestorDepth(0);
          }}
        >
          +
        </button>
        <button
          type="button"
          onClick={() => {
            setExpandedDescendants({});
            setCollapsedDescendants({});
            setExpandedSpouses({});
            setExtraAncestorDepth(0);
            setShowParents(true);
            setShowSpouses(true);
            setShowChildren(true);
            setHiddenChildren({});
          }}
        >
          {t.reset}
        </button>
      </div>
    </section>
  );
}



