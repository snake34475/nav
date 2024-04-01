<template>
  <div>
    <h4 class="text-gray">
      <i class="linecons-tag" :id="transName(item)"></i>{{ transName(item) }}
    </h4>
    <div class="row">
      <div class="col-sm-3" v-for="(web, idx) in item.web" :key="idx">
        <div class="xe-widget xe-conversations box2 label-info" title=""
             @click="openweb(web.url,web)"
             data-toggle="tooltip"
             data-placement="bottom"
             :data-original-title="web.url">

          <div class="xe-comment-entry">
            <a class="xe-user-img">
              <!-- <img :src="logoUrl(web)" class="lozad img-circle animation-element" width="40"> -->
            </a>
            <div class="xe-comment">
              <a href="#" class="xe-user-name overflowClip_1">
                <strong>{{ web.title }}</strong>
              </a>
              <p class="overflowClip_2">{{ web.desc }}</p>
            </div>
<!--            <div class="hits">点击量:{{web.title}}</div>-->
          </div>
        </div>
      </div>
    </div>
    <br/>
  </div>
</template>

<script>
// import {getPage} from "@/api";

export default {
  name: 'WebItem',
  props: {
    item: Object,
    transName: Function
  },
  computed:{
    logoUrl:(item)=>{
      // if(item.logo==='fav'){
      //   return item.url+"/favicon.ico"
      // }
      return item.logo
      
    }
  },
  methods: {
    openweb(url,wid) {
      console.log("wid:",wid)
      window.open(url, '_blank');

      // getPage({wid:wid}).then(res => {
      //   console.log(res)
      // })
    }
  }
}
</script>

<style scoped>
i {
  margin-right: 7px;
}

.box2{
  border-radius: 10px;
}
.box2 .animation-element {
  transition: transform 0.5s;
}

.box2:hover .animation-element {
  transform: rotate(360deg);
}
.hits{
  text-align: left;
  color: #999;
  font-size: 12px;
  margin-top: 5px;
}
</style>
