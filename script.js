import OBR from "@owlbear-rodeo/sdk";

// Inicializa a extensão quando o Owlbear Rodeo estiver pronto
OBR.onReady(() => {

  // =============================
  // 1️⃣ Cria o item de contexto
  // =============================
  OBR.contextMenu.createItem({
    id: "combat-helper/add-to-combat",   // ID único
    label: "Add To Combat",               // Texto do menu
    filter: {
      type: "token",                      // Apenas tokens
      layer: ["CHARACTER", "MOUNT"],      // Apenas em camadas de personagens ou montarias
    },
    onClick: async (context) => {
      const tokenId = context.token.id;
      await addToCombat(tokenId);
    },
  });

  // =============================
  // 2️⃣ (Opcional) Cria outro item de contexto para remover
  // =============================
  OBR.contextMenu.createItem({
    id: "combat-helper/remove-from-combat",
    label: "Remove From Combat",
    filter: {
      type: "token",
      layer: ["CHARACTER", "MOUNT"],
    },
    onClick: async (context) => {
      const tokenId = context.token.id;
      await removeFromCombat(tokenId);
    },
  });

  console.log("Combat Helper ready!");
});


// =============================
// 3️⃣ Função que adiciona o token ao combate
// =============================
async function addToCombat(tokenId) {
  // Pega o token atual
  const token = await OBR.scene.getToken({ id: tokenId });

  // Cria ou atualiza metadata de combate
  const combatData = {
    inCombat: true,
    hp: token.metadata.hp || 0,
    ac: token.metadata.ac || 10,
    initiative: token.metadata.initiative || 0,
  };

  // Atualiza o token com os dados de combate
  await OBR.scene.updateToken({
    id: tokenId,
    metadata: {
      ...token.metadata,
      combat: combatData,
    },
  });

  // Feedback visual para o usuário
  OBR.notification.show(`Token "${token.name}" adicionado ao combate!`);
}


// =============================
// 4️⃣ Função que remove o token do combate
// =============================
async function removeFromCombat(tokenId) {
  const token = await OBR.scene.getToken({ id: tokenId });

  if (token.metadata.combat) {
    const newMetadata = { ...token.metadata };
    delete newMetadata.combat;

    await OBR.scene.updateToken({
      id: tokenId,
      metadata: newMetadata,
    });

    OBR.notification.show(`Token "${token.name}" removido do combate!`);
  }
}


// =============================
// 5️⃣ (Opcional) Função que retorna todos tokens em combate
// =============================
export async function getCombatTokens() {
  const sceneTokens = await OBR.scene.getTokens();
  return sceneTokens.filter(t => t.metadata.combat && t.metadata.combat.inCombat);
}
