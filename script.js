// Espera o Owlbear Rodeo estar pronto
OBR.onReady(async () => {
  console.log("Combat Helper carregado!");

  // Cria itens de menu de contexto
  createContextMenu();

  // Mostra a lista de tokens em combate
  await refreshCombatList();
});

// =============================
// Cria menus de contexto
// =============================
function createContextMenu() {
  // Add to Combat
  OBR.contextMenu.createItem({
    id: "combat-helper/add-to-combat",
    label: "Add To Combat",
    filter: {
      type: "token",
      layer: ["CHARACTER", "MOUNT"]
    },
    onClick: async (context) => {
      await addToCombat(context.token.id);
      await refreshCombatList();
    }
  });

  // Remove from Combat
  OBR.contextMenu.createItem({
    id: "combat-helper/remove-from-combat",
    label: "Remove From Combat",
    filter: {
      type: "token",
      layer: ["CHARACTER", "MOUNT"]
    },
    onClick: async (context) => {
      await removeFromCombat(context.token.id);
      await refreshCombatList();
    }
  });
}

// =============================
// Adiciona token ao combate
// =============================
async function addToCombat(tokenId) {
  const token = await OBR.scene.getToken({ id: tokenId });

  const combatData = {
    inCombat: true,
    hp: token.metadata.hp || 0,
    ac: token.metadata.ac || 10,
    initiative: token.metadata.initiative || 0
  };

  await OBR.scene.updateToken({
    id: tokenId,
    metadata: {
      ...token.metadata,
      combat: combatData
    }
  });

  OBR.notification.show(`Token "${token.name}" adicionado ao combate!`);
}

// =============================
// Remove token do combate
// =============================
async function removeFromCombat(tokenId) {
  const token = await OBR.scene.getToken({ id: tokenId });

  if (token.metadata.combat) {
    const newMetadata = { ...token.metadata };
    delete newMetadata.combat;

    await OBR.scene.updateToken({
      id: tokenId,
      metadata: newMetadata
    });

    OBR.notification.show(`Token "${token.name}" removido do combate!`);
  }
}

// =============================
// Lista todos tokens em combate e atualiza UI
// =============================
async function refreshCombatList() {
  const listContainer = document.getElementById("combat-list");
  const sceneTokens = await OBR.scene.getTokens();
  const combatTokens = sceneTokens.filter(t => t.metadata.combat && t.metadata.combat.inCombat);

  if (combatTokens.length === 0) {
    listContainer.innerHTML = "<p>Nenhum token em combate.</p>";
    return;
  }

  listContainer.innerHTML = "";
  combatTokens.forEach(token => {
    const div = document.createElement("div");
    div.className = "combat-token";
    div.innerHTML = `
      <span>${token.name} (HP: ${token.metadata.combat.hp})</span>
      <span>
        <button onclick="attackToken('${token.id}')">Atacar</button>
        <button onclick="removeFromCombat('${token.id}'); refreshCombatList();">Remover</button>
      </span>
    `;
    listContainer.appendChild(div);
  });
}

// =============================
// Função de ataque simples (exemplo)
// =============================
async function attackToken(tokenId) {
  const token = await OBR.scene.getToken({ id: tokenId });
  const damage = Math.floor(Math.random() * 6) + 1; // 1d6
  const hp = (token.metadata.combat.hp || 0) - damage;

  await OBR.scene.updateToken({
    id: tokenId,
    metadata: {
      ...token.metadata,
      combat: { ...token.metadata.combat, hp }
    }
  });

  OBR.notification.show(`${token.name} sofreu ${damage} de dano! (HP: ${hp})`);
  await refreshCombatList();
}
