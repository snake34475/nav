<template>
  <div class="page-container">
    <div class="sidebar-menu toggle-others fixed">
      <div class="sidebar-menu-inner">
        <header class="logo-env">
          <!-- logo -->
          <div class="logo">
            <a href="javascript:void(0)" class="logo-expanded">
              <img src="//s2.loli.net/2023/02/01/3zOucySxfkNnhI5.png" width="100%" alt=""/>
            </a>
            <a href="javascript:void(0)" class="logo-collapsed">
              <img
                  src="//upload.onestyle.top/image/2022/07/12/wu_1g7odq5bbut1kh16a61qbd8mi6.png"
                  width="40"
                  alt=""
              />
            </a>
          </div>
          <div class="mobile-menu-toggle visible-xs">
            <a href="javascript:void(0)" data-toggle="user-info-menu">
              <i class="linecons-cog"></i>
            </a>
            <a href="javascript:void(0)" data-toggle="mobile-menu">
              <i class="fa-bars"></i>
            </a>
          </div>
        </header>
        <!-- 侧边栏 -->
        <ul id="main-menu" class="main-menu">
          <li v-for="(menu, idx) in items" :key="idx">
            <a :href="'#' + transName(menu)" class="smooth">
              <i :class="menu.icon"></i>
              <span class="title">{{ transName(menu) }}</span>
            </a>
            <ul v-if="menu.children">
              <li v-for="(submenu, idx) in menu.children" :key="idx">
                <a :href="'#' + transName(submenu)" class="smooth">
                  <span class="title">{{ transName(submenu) }}</span>
                  <span
                      v-show="submenu.is_hot"
                      class="label label-pink pull-right hidden-collapsed"
                  >Hot</span
                  >
                </a>
              </li>
            </ul>
          </li>
          <!-- 关于本站 -->
          <li class="submit-tag">
            <router-link to="/about">
              <i class="linecons-heart"></i>
              <span class="tooltip-blue">关于本站</span>
              <span class="label label-Primary pull-right hidden-collapsed"
              >♥︎</span
              >
            </router-link>
          </li>
        </ul>
      </div>
    </div>

    <div class="main-content">
      <nav class="navbar user-info-navbar" role="navigation">
        <ul class="user-info-menu left-links list-inline list-unstyled">
          <li class="hidden-sm hidden-xs">
            <a href="javascript:void(0)" data-toggle="sidebar"><i class="fa-bars"></i></a>
          </li>
          <li class="dropdown hover-line language-switcher">
            <a href="javascript:void(0)" class="dropdown-toggle" data-toggle="dropdown">
              <img :src="lang.flag"/> {{ lang.name }}
            </a>
            <ul class="dropdown-menu languages">
              <li
                  :class="{ active: langItem.key === lang.key }"
                  v-for="langItem in langList"
                  :key="langItem.key"
              >
                <a href="javascript:void(0)" @click="lang = langItem">
                  <img :src="langItem.flag"/> {{ langItem.name }}
                </a>
              </li>
            </ul>
          </li>
        </ul>
        <ul class="user-info-menu right-links list-inline list-unstyled">
          <li class="hidden-sm hidden-xs">
            <a href="https://github.com/Anjaxs/WebStack-vue" target="_blank">
              <i class="fa-github"></i> GitHub
            </a>
          </li>
        </ul>
      </nav>

      <div v-for="(item, idx) in items" :key="idx">
        <div v-if="item.web">
          <WebItem :item="item" :transName="transName"/>
        </div>
        <div v-else v-for="(subItem, idx) in item.children" :key="idx">
          <!-- 网站本体 -->
          <WebItem :item="subItem" :transName="transName"/>
        </div>
      </div>
      <Footer/>
    </div>
  </div>
</template>

<script>
import WebItem from "../components/WebItem.vue";
import Footer from "../components/Footer.vue";
import itemsData from "../assets/data.json";
import {loadJs} from '../assets/js/app.js'
// import {getPage} from "@/api";

export default {
  name: "Index",
  components: {
    WebItem,
    Footer,
  },
  data() {
    return {
      items: itemsData,
      lang: {},
      langList: [
        {
          key: "zh",
          name: "简体中文",
          flag: "./assets/images/flags/flag-cn.png",
        },
        {
          key: "en",
          name: "English",
          flag: "./assets/images/flags/flag-us.png",
        },
      ],
    };
  },
  computed:{
    // ImgeUrl(item){
    //   if(item.flag==='fav'){
    //     return item.src
    //   }
    // }
  },
  created() {
    this.lang = this.langList[0];
    loadJs();
    // getPage().then(res => {
    //   console.log("res.data", res.data)
    //   const data = res.data
    //   let arr = data.map(first => ({
    //     name: first.name || '测试',
    //     "en_name": "Tutorial",
    //     icon: first.icon || "linecons-pencil",
    //     children: first.children.map(second => ({
    //       name: second.name || '测试',
    //       "en_name": "Tutorial",
    //       web: second.web && second.web.map(third => ({
    //         ...third,
    //         logo:third.logo?"http://img.onestyle.top"+third.logo:'https://s2.loli.net/2023/04/21/VXtU641Y7hsZxpj.png',
    //         description: third.description || '测试'
    //       }))
    //     }))
    //   }))
    //   this.items = [
    //     ...itemsData,
    //     ...arr
    //   ]
    //   console.log("itemsData", itemsData)
    // })
  },
  methods: {
    transName(webItem) {
      return this.lang.key === "en" ? webItem.en_name : webItem.name;
    },
  },
};
</script>

<style>
</style>
