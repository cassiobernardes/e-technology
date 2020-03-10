<template>
<section>
  <ErroNotificacao :erros="errors" />
  <form class="adicionar-produto" enctype="multipart/form-data">
  <!-- <p class="erros" v-if="errors.length">
    <b>Por favor, corrija o(s) seguinte(s) erro(s):</b>
    <br><br>
    <ul>
      <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
    </ul>
  </p> -->
    <label for="nome">Nome</label>
    <input id="nome" name="nome" type="text" v-model="produto.nome" required/>
    <label for="preco">Preço (R$)</label>
    <input id="preco" name="preco" type="number" v-model="produto.preco" required/>
    <label for="fotos">Fotos</label>
    <input id="fotos" name="fotos" type="file" ref="fotos" required/>
    <label for="descricao">Descrição</label>
    <textarea id="descricao" name="descricao" v-model="produto.descricao" required></textarea>
    <input class="btn" type="button" value="Adicionar Produto" @click.prevent="adicionarProduto" />
  </form>
</section>
  
</template>

<script>
import { api } from "@/services.js";

export default {
  name: "ProdutoAdicionar",
  data() {
    return {
      produto: {
        nome: "",
        preco: "",
        descricao: "",
        fotos: null,
        vendido: "false",
        user: ""
      },
      errors: []
    };
  },
  methods: { 
    checkForm(){
      this.errors = [];

      if(this.produto.nome === ""){
        this.errors.push('Dê um nome ao produto.');
      }

      if(this.produto.preco === ""){
        this.errors.push('Informe o preço do produto.');
      }

      if(this.$refs.fotos.files.length === 0){
        this.errors.push('Insira uma foto do produto.');
      }

      if(this.produto.descricao === ""){
        this.errors.push('Descreva o produto.');
      }

      if(this.errors.length === 0){
        return false;
      } 

      return true;
    },
    formatarProduto() {
      const form = new FormData();

      const files = this.$refs.fotos.files;
      // for (let i = 0; i < files.length; i++) {
      //   form.append(files[i].name, files[i]);
      // }

      form.append("nome", this.produto.nome);
      form.append("preco", this.produto.preco);
      form.append("descricao", this.produto.descricao);
      form.append("vendido", this.produto.vendido);
      form.append("fotos", files[0]);
      form.append("user", this.$store.state.usuario._id);

      return form;
    },
    async adicionarProduto(event) {
      const produto = this.formatarProduto();

      if(this.checkForm()){
        return false;
      }

      const button = event.currentTarget;
      button.value = "Adicionando...";
      button.setAttribute("disabled", "");

      // this.produto.user = this.$store.state.usuario._id;
      // const files = this.$refs.fotos.files;
      // for (let i = 0; i < files.length; i++) {
      //   this.produto.fotos = files[i];
      // }

      // console.log(this.produto.fotos);

      await api.post("/produto", produto);
      await this.$store.dispatch("getUsuarioProdutos");

      button.removeAttribute("disabled");
      button.value = "Adicionar Produto";

      this.refresh();
    },
    refresh(){
      this.errors = [];
      this.produto.nome = "";
      this.produto.preco = "";
      this.produto.fotos = null;
      this.$refs.fotos.value = "";
      this.produto.descricao = "";
      this.produto.vendido = "false";
      this.produto.user = "";
    }
  }
};
</script>

<style scoped>
.adicionar-produto {
  display: grid;
  grid-template-columns: 100px 1fr;
  align-items: center;
  margin-bottom: 60px;
}

.btn {
  grid-column: 2;
}

/* .erros {
  grid-column: 2;
  margin-bottom: 30px;
  grid-template-columns: 100px 1fr;
}

b {
  color: #e80;
}

ul{
  padding-left: 30px;
  list-style:circle;
  font-size: 15px;
} */
</style>
