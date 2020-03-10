<template>
  <section>
    <div v-if="produto" class="produto">
      <ul class="fotos" v-if="produto.fotos">
        <img :src="src" alt />
      </ul>
      <div class="info">
        <h1>{{produto.nome}}</h1>
        <p class="preco">{{produto.preco | numeroPreco}}</p>
        <p class="descricao">{{produto.descricao}}</p>
        <transition mode="out-in" v-if="!produto.vendido">
          <button class="btn" v-if="!finalizar" @click="finalizar = true">Comprar</button>
          <FinalizarCompra v-else :produto="produto" />
        </transition>
        <button v-else class="btn btn-disabled" disabled>Produto Vendido</button>
      </div>
    </div>
    <PaginaCarregando v-else />
  </section>
</template>

<script>
import { api } from "@/services.js";
import FinalizarCompra from "@/components/FinalizarCompra.vue";

export default {
  name: "Produtos",
  props: ["id"],
  components: {
    FinalizarCompra
  },
  data() {
    return {
      produto: null,
      finalizar: false,
      src: ""
    };
  },
  methods: {
    getProduto() {
      api.get(`/produto/produto_id/${this.id}`).then(response => {
        this.produto = response.data.produto;
        document.title = this.produto.nome;
      });
    }
  },
  created() {
    this.getProduto();
  },
  updated() {
    this.src = "data:image/jpeg;base64," + this.produto.fotos.image;
  }
};
</script>

<style scoped>
.produto {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 30px;
  max-width: 900px;
  padding: 60px 20px;
  margin: 0 auto;
}

.preco {
  color: #e80;
  font-weight: bold;
  font-size: 1.5rem;
  margin-bottom: 40px;
}

.fotos {
  grid-row: 1 / 3;
}

.info {
  grid-row: 1 / 3;
  grid-column: 2;
  position: sticky;
  top: 20px;
}

.descricao {
  font-size: 1.2rem;
}

img {
  margin-bottom: 30px;
  box-shadow: 0 4px 8px rgba(30, 60, 90, 0.2);
  border-radius: 4px;
  max-width: 60%;
  height: auto;
}

.btn {
  margin-top: 60px;
  width: 200px;
}

@media screen and (max-width: 500px) {
  .produto {
    grid-template-columns: 1fr;
  }
  .fotos {
    grid-row: 2;
  }
  .info {
    position: initial;
  }
}
</style>
