<template>
  <div>
    <h1>Receipt annotation</h1>
    <input type="file" ref="file" @change="select" />
    <input type="button" v-on:click="submit" value="Send" />
    <div id="preview">
      <img v-if="urlRaw" :src="urlRaw" />
      <img v-if="urlAnnontated" :src="urlAnnontated" />
      {{ message }}
    </div>
  </div>
</template>

<script lang="ts">
import axios from "axios";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

console.log(process.env);

export default {
  name: "Billupload",
  /*props: {
    urlRaw: String, 
    urlAnnontated: String, 
    file: String, 
    message: String
  },*/
  data(){
    return {
      urlRaw: null,
      urlAnnontated: null,
      file: "",
      message: null
    };
  },
  methods: {
    select: function(e: any) {
      const file = e.target.files[0].tostring();
      this.urlRaw = URL.createObjectURL(file);
    },
    submit: function() {
      this.urlAnnontated = null;
      console.log("send file");

      // get file reference
      this.file = this.$refs.file.files[0];

      const formInputData = new FormData();
      formInputData.append("file", this.file);

      const httpHeader = {
        responseType: 'arraybuffer',
        headers: {
          "crossdomain": "true",
          "Content-Type": "multipart/form-data"
        }
      };

      axios
        .post(
          //"http://" + process.env.VUE_APP_HOST + ":" + process.env.VUE_APP_REST_API_PORT + "/upload_file",   // ?.tostring()
          "http://localhost:4000/upload_file",
          formInputData,
          httpHeader
        )
        .then(response => {
          //this.url = null;
          this.message = null;

          // response image
          const imageData = btoa(
            new Uint8Array(response.data)
              .reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          this.urlAnnontated = `data:${response.headers['content-type'].toLowerCase()};base64,${imageData}`;

        })
        .catch(err => {
          this.url = null;

          console.log(err);
          this.urlAnnontated = null;
          this.message = err;
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
  max-width: 500px;
  max-height: 100%;
}
</style>
