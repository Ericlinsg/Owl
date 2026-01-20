const btn = document.getElementById("btn");

btn.onclick = async () => {
  const tokens = await OBR.scene.items.getItems(
    item => item.layer === "CHARACTER" && item.selected
  );

  for (const token of tokens) {
    await OBR.scene.items.updateItems([token.id], items => {
      items[0].x += 100;
    });
  }
};
