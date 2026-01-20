// === Função que adiciona tokens ao Combat Helper ===
async function addToCombatHelper(tokens) {
  for (const token of tokens) {
    // Aqui você coloca a lógica de adicionar ao Combat Helper
    // Exemplo: se o Combat Helper tiver uma função `addToken(tokenId)`
    console.log(`Adicionando token ${token.id} ao Combat Helper`);
    // await CombatHelper.addToken(token.id); // Descomente se existir API real
  }
}

// === Registrar menu de contexto no OBR ===
OBR.contextMenus.add({
  name: "add_to_combat_helper",     // ID interno
  label: "Add to Combat Helper",    // Texto que aparece no menu
  layer: "CHARACTER",               // Só aparece para tokens da camada CHARACTER
  callback: async (clickedToken) => {
    // Pega todos os tokens selecionados na camada CHARACTER
    const tokens = await OBR.scene.items.getItems(
      item => item.layer
