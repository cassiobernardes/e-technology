<template>
  <section>
    <h1>&#128512; Compre ou Venda &#128512;</h1>
    <!-- <ProdutosBuscar /> -->
    <ProdutosListar />
  </section>
</template>

<script>
// import ProdutosBuscar from "../components/ProdutosBuscar.vue";
import ProdutosListar from "../components/ProdutosListar.vue";

export default {
  name: "home",
  components: {
    // ProdutosBuscar,
    ProdutosListar
  },
  created() {
    document.title = "Ranek";
  }
};
</script>

<style scoped>
h1 {
  color: #87f;
  margin-top: 40px;
  font-size: 2rem;
  text-align: center;
}
</style>
