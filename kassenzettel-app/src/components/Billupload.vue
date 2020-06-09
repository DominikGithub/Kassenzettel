<template>
  <div>
    <h1>Bill upload</h1>
    <!--input type="file" @change="select" />
    <input type="button" @click="send" value="Send" /-->
    
    <form action="http://116.203.120.38:4000/upload_file" enctype="multipart/form-data" method="post">
      <input type="file" name="image" @change="select">
      <input type="submit" value="send">
    </form>
    
    <div id="preview">
      <img v-if="url" :src="url" />
      <span v-html="analysis">{{ analysis }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
//import dotenv from "dotenv";
//dotenv.config({ path: './.env' });

//console.log(process.env.VUE_APP_HOST);

export default {
  name: "Billupload",
  data() {
    return {
      url: null,
      analysis: null
    };
  },
  methods: {
    select: function(e: any) {
      const file = e.target.files[0];
      this.url = URL.createObjectURL(file);
    },
    send: function() {
      console.log("send file");

      const data = new FormData();
      data.append("image", this.url);

      const httpHeader = {
        headers: {
          crossdomain: "true",
          "Content-Type": "multipart/form-data" // ; boundary=${data._boundary}
        }
      };

      axios
        .post(
          //"http://" + process.env.VUE_APP_HOST + ":" + process.env.VUE_APP_REST_API_PORT + "/upload_file",
          "http://116.203.120.38:4000/upload_file",
          data,
          httpHeader
        )
        .then(response => {
          this.url = null;
          this.analysis = response.data;
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h1 {
  margin: 40px 0 0;
}

#preview {
  display: flex;
  justify-content: center;
  align-items: center;
}

#preview img {
  max-width: 100%;
  max-height: 500px;
}
</style>
