// Reproduce onDragEnd from ResultsDragnDrog.jsx exactly.
function onDragEnd(resultsTemp, source, destination) {
  let newItems = JSON.parse(JSON.stringify(resultsTemp));
  newItems = newItems.map((item) => {
    if (source.index < destination.index) {
      if (item.order > source.index && item.order <= destination.index) item.order--;
    } else if (source.index > destination.index) {
      if (item.order >= destination.index && item.order < source.index) item.order++;
    }
    return item;
  });
  newItems.find((i) => i.name === source.name).order = destination.index;
  return newItems;
}

// The component renders sorted by order, and passes the SORTED index as dnd index.
function render(items){ return [...items].sort((a,b)=>a.order-b.order); }

let items = ["A","B","C","D","E"].map((n,i)=>({name:n, order:i}));
console.log("start        ", render(items).map(i=>`${i.name}:${i.order}`).join(" "));

// Move A (visual idx 0) to visual idx 3
let visual = render(items);
items = onDragEnd(items, {index:0, name:visual[0].name}, {index:3});
console.log("A 0->3       ", render(items).map(i=>`${i.name}:${i.order}`).join(" "));

// Now move E (visual last) to idx 1
visual = render(items);
items = onDragEnd(items, {index:4, name:visual[4].name}, {index:1});
console.log("E 4->1       ", render(items).map(i=>`${i.name}:${i.order}`).join(" "));

// Another move
visual = render(items);
items = onDragEnd(items, {index:2, name:visual[2].name}, {index:0});
console.log("idx2 -> 0    ", render(items).map(i=>`${i.name}:${i.order}`).join(" "));

const orders = items.map(i=>i.order).sort((a,b)=>a-b);
console.log("\norders sorted:", JSON.stringify(orders));
console.log("duplicates?  ", new Set(orders).size !== orders.length ? "YES - COLLISION" : "no");
