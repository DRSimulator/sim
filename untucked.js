window.generateUntucked = function (top2, bottom, high, safe, low, stats, relationships, relationshipTension) {
    const scenes = [];
    const influences = {};
    const relationshipDeltas = {};

    const rels = relationships || {};

    const toName = (x) => (x && typeof x === 'object') ? (x.name || '') : (x || '');
    const uniq = (arr) => [...new Set((arr || []).map(toName).filter(Boolean))];

    const topNames = uniq(top2);
    const bottomNames = uniq(bottom);
    const otherNames = uniq([...(high || []), ...(safe || []), ...(low || [])]);
    const allNames = uniq([...topNames, ...bottomNames, ...otherNames]);

    bottomNames.forEach(n => { influences[n] = { avoid: 0, target: 0 }; });

    const getRel = (a, b) => rels[getRelationshipKey(a, b)] || 'neutral';

    const weightByRel = (rel) => {
        if (rel === 'drag_family') return 2.4;
        if (rel === 'chop') return 3.0;
        if (rel === 'bad') return 2.0;
        if (rel === 'great') return 1.6;
        if (rel === 'good') return 1.2;
        if (rel === 'neutral') return 0.6;
        return 0;
    };

    const pairs = [];
    for (let i = 0; i < allNames.length; i++) {
        for (let j = i + 1; j < allNames.length; j++) {
            const a = allNames[i];
            const b = allNames[j];
            const rel = getRel(a, b);
            const w = weightByRel(rel);
            if (w <= 0) continue;
            pairs.push({ a, b, rel, w });
        }
    }

    pairs.sort((x, y) => (y.w - x.w) || ((Math.random() < 0.5) ? -1 : 1));
    const maxScenes = Math.max(3, Math.ceil(allNames.length / 3));
    const reservedGenericScenes = Math.max(1, Math.min(2, Math.floor(maxScenes / 4)));
    const nonGenericTarget = Math.max(0, maxScenes - reservedGenericScenes);
    const reservedRoleScenes = Math.min(
        (topNames.length ? 1 : 0) + (bottomNames.length ? 1 : 0),
        Math.max(0, nonGenericTarget - 1)
    );

    const relBucket = (rel) => {
        if (rel === 'drag_family') return 'family';
        if (rel === 'good' || rel === 'great') return 'support';
        if (rel === 'bad' || rel === 'chop') return 'conflict';
        return 'neutral';
    };

    const supportTemplates = [
        (a, b) => `${a} hypes up ${b}: "You're a STAR, baby!"`,
        (a, b) => `${a} defends ${b} from the other queens' criticism.`,
        (a, b) => `${a} helps ${b} fix their makeup before the runway.`
    ];
    const familyTemplates = [
        (a, b) => `${a} tells ${b}: "We did our family proud tonight."`,
        (a, b) => `${a} and ${b} kiki about their drag family roots.`,
        (a, b) => `${a} says ${b} is like a sister in this competition.`
    ];
    const conflictTemplates = [
        (a, b) => `${a} calls ${b} a "chop hoe bird".`,
        (a, b) => `${a} reads ${b} for filth in front of everyone.`,
        (a, b) => `${a} whispers about ${b} to the other queens.`,
        (a, b) => `${a} will block ${b} on Instagram.`,
        (a, b) => `${a} says ${b}'s padding looks like a Minecraft character.`
    ];
    const neutralTemplates = [
        (a, b) => `${a} and ${b} talk about how wild the judges can be.`,
        (a, b) => `${a} asks ${b} how the day felt backstage.`,
        (a, b) => `${a} and ${b} joke about the cameras catching everything.`
    ];
    const genericTemplates = [
        (q) => ({ type: 'drama', text: `${q} calls out the judges for their questionable taste.` }),
        (q) => ({ type: 'honest', text: `${q} confesses: "I don't think I did well today."` }),
        (q) => ({ type: 'delulu', text: `${q} is so happy to look like a mess.` }),
        (q) => ({ type: 'honest', text: `${q} likes the drink.` })
    ];
    const topSoloMoments = [
        (q) => ({ type: 'drama', queen: q, text: `${q} glows in Untucked: "Finally the judges noticed me!"` }),
        (q) => ({ type: 'strategy', queen: q, text: `${q} says it's important to secure the momentum.` }),
        (q) => ({ type: 'delulu', queen: q, text: `${q} is convinced this is just the beginning of her winning streak.` })
    ];
    const topPairMoments = [
        (a, b) => ({ type: 'strategy', queen: a, target: b, text: `${a} and ${b} plot how to keep the other queens from catching up.` }),
        (a, b) => ({ type: 'strategy', queen: a, target: b, text: `${a} tells ${b}: "We can't let them get comfortable now."` }),
        (a, b) => ({ type: 'honest', queen: a, target: b, text: `${a} congratulates ${b}: "You killed it tonight!"` })
    ];
    const bottomSoloMoments = [
        (q) => ({ type: 'honest', queen: q, text: `${q} exhales heavily: "I'm in the bottom... I'm genuinely scared."` }),
        (q) => ({ type: 'honest', queen: q, text: `${q} says she's ready to fight for her spot.` }),
        (q) => ({ type: 'drama', queen: q, text: `${q} panics and replays what could have gone wrong.` })
    ];
    const bottomPairMoments = [
        (a, b) => ({ type: 'honest', queen: a, target: b, text: `${a} and ${b} are in the bottom and are trying to keep their position, but tension is felt.` }),
        (a, b) => ({ type: 'drama', queen: a, target: b, text: `${a} says ${b}: "We can't let them get comfortable now."` }),
        (a, b) => ({ type: 'drama', queen: a, target: b, text: `${a} tells ${b}: "Pack your bags now to save time later."` })
    ];

    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const shuffle = (arr) => {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
        return arr;
    };

    let genericBag = [];
    const nextGenericTemplate = () => {
        if (!genericBag.length) genericBag = shuffle([...genericTemplates]);
        return genericBag.pop();
    };

    const queenSceneCount = {};
    const maxScenesPerQueen = Math.max(2, Math.ceil(maxScenes / 3));
    const pairKey = (a, b) => (a < b) ? `${a}||${b}` : `${b}||${a}`;
    const selectedPairKeys = new Set();

    const pickTwoDistinct = (arr) => {
        if (!arr || arr.length < 2) return null;
        const a = arr[Math.floor(Math.random() * arr.length)];
        let b = a;
        let guard = 0;
        while (b === a && guard < 10) {
            b = arr[Math.floor(Math.random() * arr.length)];
            guard++;
        }
        if (b === a) return null;
        return [a, b];
    };

    const canUseScene = (s) => {
        const q = s.queen;
        const t = s.target;
        if (q && (queenSceneCount[q] || 0) >= maxScenesPerQueen) return false;
        if (t && (queenSceneCount[t] || 0) >= maxScenesPerQueen) return false;
        return true;
    };
    const applySceneCounts = (s) => {
        if (s.queen) queenSceneCount[s.queen] = (queenSceneCount[s.queen] || 0) + 1;
        if (s.target) queenSceneCount[s.target] = (queenSceneCount[s.target] || 0) + 1;
    };

    const roleCandidates = [];
    if (topNames.length) {
        if (topNames.length >= 2 && Math.random() < 0.45) {
            const ab = pickTwoDistinct(topNames);
            if (ab) roleCandidates.push(pick(topPairMoments)(ab[0], ab[1]));
        } else {
            const q = pick(topNames);
            roleCandidates.push(pick(topSoloMoments)(q));
        }
    }
    if (bottomNames.length) {
        if (bottomNames.length >= 2 && Math.random() < 0.45) {
            const ab = pickTwoDistinct(bottomNames);
            if (ab) roleCandidates.push(pick(bottomPairMoments)(ab[0], ab[1]));
        } else {
            const q = pick(bottomNames);
            roleCandidates.push(pick(bottomSoloMoments)(q));
        }
    }

    shuffle(roleCandidates);
    for (let i = 0; i < roleCandidates.length && scenes.length < reservedRoleScenes; i++) {
        const s = roleCandidates[i];
        if (!s) continue;
        if (!canUseScene(s)) continue;
        scenes.push(s);
        applySceneCounts(s);
    }

    const buckets = { family: [], support: [], conflict: [], neutral: [] };
    pairs.forEach(p => { buckets[relBucket(p.rel)].push(p); });

    const activeTypes = ['family', 'support', 'conflict', 'neutral'].filter(t => buckets[t].length > 0);
    const desiredCounts = { family: 0, support: 0, conflict: 0, neutral: 0 };
    activeTypes.forEach(t => { desiredCounts[t] = 1; });

    let remaining = maxScenes - activeTypes.length;
    if (remaining < 0) {
        desiredCounts.neutral = 0;
        remaining = maxScenes - ['family', 'support', 'conflict'].filter(t => desiredCounts[t] > 0).length;
        if (remaining < 0) {
            desiredCounts.family = 0;
            desiredCounts.support = 0;
            desiredCounts.conflict = 0;
            desiredCounts.neutral = maxScenes;
            remaining = 0;
        }
    }

    const totalW = {};
    let totalAll = 0;
    activeTypes.forEach(t => {
        const s = buckets[t].reduce((acc, p) => acc + p.w, 0);
        totalW[t] = s;
        totalAll += s;
    });

    while (remaining > 0) {
        let bestType = null;
        let bestScore = -Infinity;
        activeTypes.forEach(t => {
            const w = totalW[t] || 0;
            const score = (totalAll > 0 ? w / totalAll : 1) / (desiredCounts[t] + 1);
            if (score > bestScore) {
                bestScore = score;
                bestType = t;
            }
        });
        if (!bestType) break;
        desiredCounts[bestType] += 1;
        remaining -= 1;
    }

    const sceneTypeCount = { family: 0, support: 0, conflict: 0, neutral: 0 };
    const pickType = (excluded) => {
        const available = activeTypes.filter(t => !excluded.has(t));
        if (!available.length) return null;

        let best = [];
        let bestDeficit = -Infinity;
        available.forEach(t => {
            const deficit = desiredCounts[t] - sceneTypeCount[t];
            if (deficit > bestDeficit) {
                bestDeficit = deficit;
                best = [t];
            } else if (deficit === bestDeficit) {
                best.push(t);
            }
        });

        if (bestDeficit > 0) return pick(best);

        let minCount = Infinity;
        let mins = [];
        available.forEach(t => {
            const c = sceneTypeCount[t];
            if (c < minCount) {
                minCount = c;
                mins = [t];
            } else if (c === minCount) {
                mins.push(t);
            }
        });
        return pick(mins);
    };

    const pickPairFromBucket = (type) => {
        let best = null;
        let bestScore = -Infinity;
        const arr = buckets[type] || [];
        for (let i = 0; i < arr.length; i++) {
            const p = arr[i];
            const key = pairKey(p.a, p.b);
            if (selectedPairKeys.has(key)) continue;

            const ca = queenSceneCount[p.a] || 0;
            const cb = queenSceneCount[p.b] || 0;
            if (ca >= maxScenesPerQueen || cb >= maxScenesPerQueen) continue;

            const score = p.w - (ca + cb) * 0.9 + Math.random() * 0.35;
            if (score > bestScore) {
                bestScore = score;
                best = p;
            }
        }
        if (!best) return null;

        selectedPairKeys.add(pairKey(best.a, best.b));
        queenSceneCount[best.a] = (queenSceneCount[best.a] || 0) + 1;
        queenSceneCount[best.b] = (queenSceneCount[best.b] || 0) + 1;
        sceneTypeCount[type] += 1;
        return best;
    };

    const pushSceneFromPair = (p) => {
        const { a, b, rel } = p;
        const speaker = Math.random() < 0.5 ? a : b;
        const target = speaker === a ? b : a;

        if (rel === 'drag_family') {
            scenes.push({ type: 'support', queen: speaker, target, text: pick(familyTemplates)(speaker, target) });
        } else if (rel === 'good' || rel === 'great') {
            scenes.push({ type: 'support', queen: speaker, target, text: pick(supportTemplates)(speaker, target) });
        } else if (rel === 'bad' || rel === 'chop') {
            scenes.push({ type: 'shade', queen: speaker, target, text: pick(conflictTemplates)(speaker, target) });
        } else {
            scenes.push({ type: 'drama', queen: speaker, target, text: pick(neutralTemplates)(speaker, target) });
        }
    };

    while (scenes.length < nonGenericTarget && activeTypes.length) {
        const excluded = new Set();
        let picked = false;

        for (let attempts = 0; attempts < activeTypes.length; attempts++) {
            const t = pickType(excluded);
            if (!t) break;
            excluded.add(t);
            const p = pickPairFromBucket(t);
            if (!p) continue;
            pushSceneFromPair(p);
            picked = true;
            break;
        }

        if (!picked) break;
    }

    while (scenes.length < nonGenericTarget) {
        const p = pickPairFromBucket('neutral');
        if (!p) break;
        pushSceneFromPair(p);
    }

    let queenBag = [];
    const nextQueen = () => {
        if (!queenBag.length) queenBag = shuffle([...allNames]);
        return queenBag.pop();
    };

    while (scenes.length < maxScenes && allNames.length) {
        let q = null;
        for (let i = 0; i < allNames.length; i++) {
            const candidate = nextQueen();
            if ((queenSceneCount[candidate] || 0) < maxScenesPerQueen) {
                q = candidate;
                break;
            }
        }
        if (!q) q = nextQueen();

        queenSceneCount[q] = (queenSceneCount[q] || 0) + 1;
        const tmpl = nextGenericTemplate();
        const g = tmpl(q);
        scenes.push({ type: g.type, queen: q, text: g.text });
    }

    const bottomByPPE = [...(bottom || [])]
        .map(x => (x && typeof x === 'object') ? x : { name: x })
        .sort((a, b) => (stats[a.name]?.ppe ?? 0) - (stats[b.name]?.ppe ?? 0));

    const worseTR = bottomByPPE[0]?.name;
    const betterTR = bottomByPPE[bottomByPPE.length - 1]?.name;

    return { scenes, influences, worseTR, betterTR, relationshipDeltas };
};
