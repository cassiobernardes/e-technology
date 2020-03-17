<template>
  <section>
    <h2>Crie a Sua Conta</h2>
    <transition mode="out-in">
      <button v-if="!criar" class="btn" @click="criar = true">Criar Conta</button>
      <UsuarioForm v-else>
        <button class="btn btn-form" @click.prevent="criarUsuario">Criar Usuário</button>
      </UsuarioForm>
    </transition>
    <ErroNotificacao :erros="erros" />
  </section>
</template>

<script>
import UsuarioForm from "@/components/UsuarioForm.vue";

export default {
  name: "LoginCriar",
  components: {
    UsuarioForm
  },
  data() {
    return {
      criar: false,
      erros: []
    };
  },
  methods: {
    async criarUsuario(event) {
      this.erros = [];
      const button = event.currentTarget;
      button.value = "Criando...";
      button.setAttribute("disabled", "");
      try {
        await this.$store.dispatch("criarUsuario", this.$store.state.usuario);
        await this.$store.dispatch("logarUsuario", this.$store.state.usuario);
        await this.$store.dispatch(
          "getUsuario",
          this.$store.state.usuario.email
        );
        this.$router.push({ name: "usuario" });
      } catch (error) {
        button.removeAttribute("disabled");
        button.value = "Criar Usuário";
        this.erros.push(error.response.data.message);
      }
    }
  }
};
</script>

<style scoped>
h2 {
  text-align: center;
  margin-top: 40px;
  margin-bottom: 10px;
}

.btn {
  width: 100%;
  max-width: 200px;
  margin-left: auto;
  margin-right: auto;
  grid-column: 2;
  align-items: center;
}

.btn-form {
  max-width: 100%;
}
</style>
