<template>
  <section>
    <h2>Compras</h2>
    <div v-if="compras !== null && compras.length === 0">
      <h3>Você não possui vendas até o momento.</h3>
    </div>
    <div v-else-if="compras !== null && compras.length > 0">
      <div class="produtos-wrapper" v-for="(compra, index) in compras" :key="index">
        <ProdutoItem v-if="compra.produto" :produto="compra.produto">
          <p class="vendedor">
            <span>Vendedor:</span>
            {{compra.vendedor.email}}
          </p>
        </ProdutoItem>
      </div>
    </div>
    <PaginaCarregando v-else />
  </section>
</template>

<script>
import ProdutoItem from "@/components/ProdutoItem.vue";
import { api } from "@/services.js";
import { mapState } from "vuex";

export default {
  components: {
    ProdutoItem
  },
  data() {
    return {
      compras: null,
      quantidade: 0
    };
  },
  computed: {
    ...mapState(["usuario", "login"])
  },
  methods: {
    getCompras() {
      api.get(`/transacao/comprador_id/${this.usuario._id}`).then(response => {
        this.compras = response.data.transactions;
      });
    }
  },
  watch: {
    login() {
      this.getCompras();
    }
  },
  created() {
    if (this.login) {
      this.getCompras();
    }
  }
};
</script>

<style scoped>
.produto-wrapper {
  margin-bottom: 40px;
}

.vendedor span {
  color: #e80;
}

h2 {
  margin-bottom: 20px;
}
</style>
