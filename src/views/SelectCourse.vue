<template>
  <div class="overflow: auto">
    <div class="query-c" style="width:800px;margin:auto;">
      <Input placeholder="请输入学号" style="width: 400px;padding-top:50px" v-model.lazy="inputSid">
        <Icon type="ios-contact" slot="prefix" style="padding-top:50px" />
      </Input>
    </div>
    <br />
    <template>
      <el-row :gutter="10">
        <div style="width:900px;margin:auto;">
          <el-table
            ref="multipleTable"
            tooltip-effect="dark"
            :data="tabledata"
            stripe
            @selection-change="handleSelectChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="课程编号" prop="cid" width="200"></el-table-column>
            <el-table-column label="课程名称" prop="name" width="200"></el-table-column>
            <el-table-column label="先导课" prop="fcid" width="200"></el-table-column>
            <el-table-column label="学分" prop="credit" width="200"></el-table-column>
          </el-table>
        </div>
      </el-row>

      <el-row :gutter="10">
        <div style="width:400px;float:right">
          <span style="padding-right:10px">共选择：{{this.selectLength}}门课</span>
          <el-button type="success" plain @click="showSelectList">提交选课</el-button>
          <el-button>取消选课</el-button>
        </div>
      </el-row>
    </template>
    <br />
    <el-dialog title="确认选课" :visible.sync="dialogFormVisible" width="30%">
      <span>是否选择如下课程？</span>
      <el-table :data="multipleSelection" style="width:380px;margin:auto">
        <el-table-column property="cid" label="课程编号" width="80"></el-table-column>
        <el-table-column property="name" label="课程名称" width="150"></el-table-column>
        <el-table-column property="fcid" label="先导课" width="75"></el-table-column>
        <el-table-column property="credit" label="学分" width="75"></el-table-column>
      </el-table>
      <div id="dialogfooter" style="width:100%">
        <div style="margin-left:200px">
          <el-button type="primary" @click="selectCourse">确定</el-button>
          <el-button @click="dialogFormVisible=false">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "selectcourse",
  data() {
    return {
      tabledata: Array,
      inputSid: "",
      dialogFormVisible: false,
      searchType: "bySid", // 默认按学号查询
      multipleSelection: [],
      selectLength: 0,
      postData: {
        sid: "",
        cids: ""
      }
    };
  },
  methods: {
    getData() {
      //   console.log(this.page);
      axios({
        // /course/getCourseByPage
        url: "/api/course/searchall",
        method: "get",
        params: {},
        headers: {
          "Content-type": "application/x-www-form-urlencoded"
        }
      })
        .then(res => {
          this.tabledata = res;
        })
        .catch(error => {
          console.log(error);
        });
    },
    search() {
      console.log(this.inputSid);
    },
    handleSelectChange(val) {
      // 点选课程时动态修改this.multipleSelection的值
      this.multipleSelection = val;
      this.selectLength = this.multipleSelection.length;
    },
    createData() {
      //首先构造数据
      this.postData.sid = this.inputSid;
      let cids = "";
      for (let i of this.multipleSelection) {
        cids += i.cid + ";";
      }
      // 传出的数据形式是：cid1;cid2;cid3;
      this.postData.cids = cids;
    },
    showSelectList() {
      this.dialogFormVisible = true;
    },
    selectCourse() {
      this.createData();
      if (this.inputSid == "") {
        alert("请输入学号");
      } else {
        axios({
          // http://211.87.231.59:8080/student/save
          url: "/api/sc/insert",
          // url: "/student/insert",
          method: "post",
          params: {
            sid: this.postData.sid,
            cids: this.postData.cids
          },
          headers: {
            "Content-type": "application/x-www-form-urlencoded"
          }
        })
          .then(res => {
            console.log(res);
            // this.$message("插入成功");
            if (res) {
              // success
              this.$message({
                message: "新增成功",
                type: "success"
              });
              this.dialogFormVisible = false;
              this.getData();
            } else {
              this.$message.error("新增失败");
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  },
  created() {
    this.getData();
  }
};
</script>

<style lang='less' scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
</style>