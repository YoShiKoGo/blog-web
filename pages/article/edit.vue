<template>
  <div>
    <el-form ref="formData" :rules="rules" :model="formData" label-width="100px" label-position="right">
      <el-form-item label="标题：" prop="title">
        <el-input v-model="formData.title" placeholder="请输入标题" maxlength="50" show-word-limit/>
      </el-form-item>

      <el-form-item label="标签：" prop="labelIds">
        <!--emitPath: false只返回标签的id-->
        <el-cascader
          style="display: block"
          placeholder="请选择："
          :options="labelOptions"
          :show-all-levels="false"
          :props="{ multiple: true, emitPath: false, children: 'labelList', value: 'id', label: 'name' }"
          :disabled= disabled
          filterable
          clearable
          v-model="formData.labelIds"
        >
        </el-cascader>
      </el-form-item>

      <el-form-item label="主图：" prop="imageUrl">
        <!--
         action:上传图片调用的地址
         accept:上传图片类型
         show-file-list:是否列表展示上传的文件
        -->
        <el-upload
          class="avatar-uploader"
          action=""
          accept="image/*"
          :show-file-list="false"
          :http-request="uploadMainImg"
        >
          <img v-if="formData.imageUrl" :src="formData.imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>

      <el-form-item label="是否公开：" prop="isPublic">
        <el-radio-group v-model="formData.isPublic">
          <el-radio :label="0">不公开</el-radio>
          <el-radio :label="1">公开</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="简介：" prop="summary">
        <el-input type="textarea" v-model="formData.summary" placeholder="请输入简介"
                  maxlength="2000" show-word-limit :autosize="{minRows: 3}"/>
      </el-form-item>

      <el-form-item label="内容：" prop="content">
        <!--
          v-model绑定的md输入框的内容
          ref 唯一表示，相当于id
        -->
        <mavon-editor ref="md"
                      v-model="formData.mdContent"
                      @change="getMdHtml"
                      @imgAdd="uploadContentImg"
                      @imgDel="delContentImg"
        />
      </el-form-item>
    </el-form>
    <el-row type="flex" justify="center">
      <el-button type="primary" @click="submitForm('formData')">提交审核</el-button>
    </el-row>
  </div>
</template>

<script>
  export default {
    validator({query}){
      // 如果有id, 则是修改操作
      if(query.id){
        return /^\d+$/.test(query.id)
      }
      return true
    },

    data(){
      // Lable校验规则
      const validateLable = (rule, value, callback)=>{
        if(value && value.length>5){
          this.disabled = true // 禁止选择
          callback(new Error('最多可选5个标签'))
        }else {
          this.disabled = false // 可以选择
          callback()//校验通过
        }
      }
      // Content校验规则
      const validateContent = (rule, value, callback)=>{
        if(this.formData.mdContent && this.formData.htmlContent){
          callback()//校验通过
        }else {
          callback(new Error('请输入文章内容'))
        }
      }

      return {
        // 校验规则
        rules:{
          title:[{ required: true, message: '请输入标题', trigger: 'blur' }],
          labelIds:[
            { required: true, message: '请选择标签', trigger: 'blur' },
            { validator: validateLable,  trigger: 'change'},
          ],
          isPublic:[{ required: true, message: '请选择是否公开', trigger: 'change' },],
          summary:[{ required: true, message: '请输入简介', trigger: 'blur' },],
          content:[
            // { required: true, message: '请输入内容', trigger: 'blur' },
            { validator: validateContent, trigger: 'change' },
          ],
        },
        // 表单数据
        formData: {
          imageUrl: null // 不写不会显示图片
        },
        disabled: false, //标签选择框： false可选择，true不可选择
        // 标签选项
        labelOptions: [
          {
            id: 1, // 类别id
            name: '前端', // 类别名称
            labelList: [ // 标签集合
              {
                id: 1, // 标签id
                name: 'html', // 标签名称
              },
              {
                id: 2, // 标签id
                name: 'js', // 标签名称
              },
              {
                id: 3, // 标签id
                name: 'vue.js', // 标签名称
              }
            ]
          },
          {
            id: 2, // 类别id
            name: 'Java', // 类别名称
            labelList: [ // 标签集合
              {
                id: 4, // 标签id
                name: 'spring', // 标签名称
              },
              {
                id: 5, // 标签id
                name: 'servlet', // 标签名称
              },
              {
                id: 6, // 标签id
                name: 'mybatis', // 标签名称
              }
            ]
          }
        ]
      }
    },
    methods: {
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitData()
          } else {
            console.log('error submit!!');
            return false;
          }
        });
        console.log('提交表单', formName)
      },

      async submitData(){
        // 判断是新增还是更新 有id更新，没有id新增
        let res = null
        if(this.formData.id){
          // 修改
          res = await this.$updateArticle(this.formData);
        }else {
          // 新增
          res = await this.$addArticle(this.formData);
        }
        if(res.code === 20000){
          // res.data为文章id
          this.$message.success('提交成功')
          // 提交成功后跳转至新文章页面
          this.$router.push(`/article/${res.data}`)
        }else {
          this.$message.error('提交失败')
        }
      },

      // 上传图片
      uploadMainImg(file){
        console.log('file',file)
        // 封装上传图片的表单对象
        const data = new FormData()
        data.append('file',file.file)
        this.$uploadImg(data).then(response => {
          if (response.code === 20000){
            console.log('上传主图片成功')
            // 删除原图片,回显上传后的图片
            this.deleteImg()
            this.formData.imageUrl = response.data
          }
        }).catch(error=>{
          this.$message.error('上传图片失败')
        })
      },

      // 删除图片
      deleteImg() {
        if(this.formData.imageUrl){
          // 如果有原图地址，则删除
          console.log('删除原有图片地址',this.formData.imageUrl)
          this.$deleteImg(this.formData.imageUrl)
        }
      },

      // mdContent:md内容，htmlContent: html内容
      getMdHtml(mdContent, htmlContent){
        // console.log('mdContent',mdContent)
        // console.log('htmlContent',htmlContent)
        this.formData.mdContent = mdContent
        this.formData.htmlContent = htmlContent
      },

      // 上传内容图片(图片位置编号, file对象)
      uploadContentImg(pos, file){
        console.log('上传内容图片',file)
        const data = new FormData()
        data.append('file',file.file)
        this.$uploadImg(data).then(response => {
          if (response.code === 20000){
            console.log('上传内容图片成功')
            this.$refs.md.$img2Url(pos, response.data)
          }
        }).catch(error=>{
          this.$message.error('上传内容图片失败')
        })
      },

      //
      delContentImg(urlAndFileArr){
        const fileUrl = urlAndFileArr[0] //图片url
        const file = urlAndFileArr[1]  // File对象
        console.log('删除内容图片',fileUrl,file)
        this.$deleteImg(fileUrl)

      }

    },
    async asyncData({app, query}){
      // 查询分类标签
      const {data} = await app.$getCategoryAndLabel()
      // 查询文章详情
      if(query.id){
        const {data: formData} = await app.$getArticleById(query.id)
        return {labelOptions: data, formData}
      }
      return {labelOptions: data}
    },
  }
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #6a737d;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
