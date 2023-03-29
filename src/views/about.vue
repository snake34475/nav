<template>
  <div class="boxed-container">
    <nav class="navbar horizontal-menu navbar-fixed-top">
      <div class="navbar-inner">
        <div class="navbar-brand">
          <router-link to="/" class="logo">
            <img src="//s2.loli.net/2023/02/01/3zOucySxfkNnhI5.png" width="18%" alt="" class="hidden-xs">
<!--            <img src="../assets/images/logo@2x.png" width="100%" alt="" class="visible-xs">-->
          </router-link>
        </div>
        <div class="navbar-mobile-clear"></div>
        <a href="https://github.com/Anjaxs/WebStack-vue" target="_blank">
           <img style="position: absolute; top: 0; right: 0; border: 0;"
               src="https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png"
               alt="Fork me on GitHub">
        </a>
      </div>
    </nav>

    <div class="page-container">
      <div class="main-content" style="">
        <div class="row">
          <div class="col-md-12">
            <div class="panel panel-default">
              <!-- 关于网站 -->
              <h4 class="text-gray">关于网站</h4>
              <div class="panel-body">
                <div class="row">
                  <div class="col-sm-12">
                    <blockquote>
                      <p>有一段时间我发现我的收藏夹越来越多，很难找到某个不常用的网站。
                        所以就有了这个网站，这里收集的基本都是我自己浏览器收藏夹里的网站，我平时用的相对比较多的一些都在这里。</p>
                      <br />
                      <p>如果你也是程序员，如果你也正好喜欢编程，那希望这个网站能给你带来一些作用。</p>
                    </blockquote>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  </div>
</template>

<script>
import Footer from '../components/Footer.vue'

export default {
  name: 'About',
  components: {
    Footer
  },
  data() {
    return {
      authorImg: './assets/images/logos/viggoz.png'
    }
  }
}
</script>

<style>
</style>
