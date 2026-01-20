<!-- Se ainda não incluiu o SDK no seu index.html, adicione antes do seu script -->
<script src="https://unpkg.com/@owlbear-rodeo/sdk/dist/sdk.min.js"></script>

<script>
  // Espera o Owlbear Rodeo estar pronto
  OBR.onReady(() => {

    // =============================
    // 1️⃣ Adiciona "Add To Combat" no menu de contexto
    // =============================
    OBR.contextMenu.createItem({
      id: "combat-helper/add-to-combat",
      label: "Add To Combat",
      filter: {
        type: "token",
        layer: ["CHARACTER", "MOUNT"]
      },
      onClick: async (context) => {
        const tokenId = context.token.id;
        await addToCombat(tokenId);
      }
    });

    // =============================
    // 2️⃣ Adiciona "Remove From Combat" no menu de contexto
    // =============================
    OBR.contextMenu.createItem({
      id: "combat-helper/remove-from-combat",
      label: "Remove From Combat",
      filter: {
        type: "token",
        layer: ["CHARACTER", "MOUNT"]
      },
      onClick: async (context) => {
        const tokenId = context.token.id;
        await removeFromCombat(tokenId);
      }
    });

    console.log("Combat Helper ready!");
  });

  // =============================
  // 3️⃣ Função que adiciona o token ao combate
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
  // 4️⃣ Função que remove o token do combate
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
  // 5️⃣ Função opcional: retorna todos tokens em combate
  // =============================
  async function getCombatTokens() {
    const sceneTokens = await OBR.scene.getTokens();
    return sceneTokens.filter(t => t.metadata.combat && t.metadata.combat.inCombat);
  }

</script>
