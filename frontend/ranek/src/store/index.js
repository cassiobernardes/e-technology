import Vue from "vue";
import Vuex from "vuex";
import { api } from "@/services.js";
Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    login: false,
    usuario: {
      _id: "",
      nome: "",
      email: "",
      senha: "",
      cep: "",
      rua: "",
      numero: "",
      bairro: "",
      cidade: "",
      estado: ""
    },
    usuario_produtos: null
  },
  mutations: {
    UPDATE_LOGIN(state, payload) {
      state.login = payload;
    },
    UPDATE_USUARIO(state, payload) {
      if (payload.user !== undefined)
        state.usuario = Object.assign(state.usuario, payload.user);
      else state.usuario = Object.assign(state.usuario, payload);
    },
    UPDATE_USUARIO_PRODUTOS(state, payload) {
      state.usuario_produtos = payload.products;
    },
    ADD_USUARIO_PRODUTOS(state, payload) {
      state.usuario_produtos.unshit(payload);
    },
    CLEAR_USUARIO_SENHA(state){
      state.usuario.senha = "";
    }
  },
  actions: {
    getUsuarioProdutos(context) {
      api
        .get(`/produto/usuario_id/${context.state.usuario._id}`)
        .then(response => {
          context.commit("UPDATE_USUARIO_PRODUTOS", response.data);
        });
    },
    getUsuario(context, payload) {
      return api.get(`/usuario/${payload}`).then(response => {
        context.commit("UPDATE_USUARIO", response.data);
        context.commit("UPDATE_LOGIN", true);
      });
    },
    criarUsuario(context, payload) {
      return api.post("/auth/register", payload);
    },
    logarUsuario(context, payload) {
      return api
        .login({
          email: payload.email,
          senha: payload.senha
        })
        .then(response => {
          window.localStorage.token = response.data.token;
        });
    },
    deslogarUsuario(context) {
      context.commit("UPDATE_USUARIO", {
        _id: "",
        nome: "",
        email: "",
        senha: "",
        cep: "",
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: ""
      });
      context.commit("UPDATE_LOGIN", false);
      window.localStorage.removeItem("token");
    }
  }
});
