<template>
  <section>
    <UsuarioForm>
      <button class="btn" @click.prevent="atualizarUsuario">Atualizar Usuário</button>
    </UsuarioForm>
    <ErroNotificacao :erros="erros" />
  </section>
</template>

<script>
import UsuarioForm from "@/components/UsuarioForm.vue";
import { api } from "@/services.js";

export default {
  name: "UsuarioEditar",
  components: {
    UsuarioForm
  },
  data() {
    return {
      erros: [],
      emailAntigo: "",
      atualizou: false
    };
  },
  methods: {
    atualizarUsuario() {

      if(this.checkForm()){
        return false;
      }

      api
        .put(
          `/usuario/${this.$store.state.usuario._id}`,
          this.$store.state.usuario
        )
        .then(() => {
          this.$store.dispatch("getUsuario", this.$store.state.usuario);
          this.$store.commit("CLEAR_USUARIO_SENHA");
          this.atualizou = true;
          this.$router.push({ name: "usuario" });
        })
        .catch(error => {
          this.erros.push(error.response.data.message);
        });
    },
    checkForm(){
      this.erros = [];

      if(this.$store.state.usuario.nome === ""){
        this.erros.push('Digite seu nome.');
      }

      if(this.$store.state.usuario.email === ""){
        this.erros.push('Digite seu e-mail.');
      }

      if(this.$store.state.usuario.senha === ""){
        this.erros.push('Digite sua senha.');
      }

      if(this.$store.state.usuario.cep === ""){
        this.erros.push('Digite o CEP.');
      }

      if(this.$store.state.usuario.rua === ""){
        this.erros.push('Digite a rua.');
      }

      if(this.$store.state.usuario.numero === ""){
        this.erros.push('Digite o da residência.');
      }

      if(this.$store.state.usuario.bairro === ""){
        this.erros.push('Digite o bairro.');
      }

      if(this.$store.state.usuario.cidade === ""){
        this.erros.push('Digite a cidade.');
      }

      if(this.$store.state.usuario.estado === ""){
        this.erros.push('Digite o estado.');
      }

      if(this.erros.length === 0){
        return false;
      } 

      return true;
    }
  },
  created(){
    this.emailAntigo = this.$store.state.usuario.email;
  },
  destroyed(){
    if(!this.atualizou){
      this.$store.commit("CLEAR_USUARIO_SENHA");
      this.$store.dispatch("getUsuario", this.emailAntigo);
    }
  }
};
</script>

<style scoped>
.btn {
  grid-column: 2;
}
</style>