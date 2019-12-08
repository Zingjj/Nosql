<template>
  <div class="overflow: auto">
    <div class="query-c" style="width:800px;">
      查询：
      <Input
        search
        placeholder="请输入关键词进行查询"
        style="width: 300px"
        v-model="keyword"
        @on-search="searchByKeyword()"
      />
      <el-button type="primary" round style="float:right" @click="addTeacher">添加教师</el-button>
    </div>
    <br />
    <template>
      <el-table :data="tabledata" stripe style="width: 100%">
        <el-table-column label="教师编号" prop="tid" width="150"></el-table-column>
        <el-table-column label="姓名" prop="name" width="150"></el-table-column>
        <el-table-column label="性别" prop="sex" width="100"></el-table-column>
        <el-table-column label="年龄" prop="age" width="100"></el-table-column>
        <el-table-column label="院系" prop="dname" width="200"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="updateTch(scope.$index,scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteTch(scope.$index,scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <br />
    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form" style="width:500px;margin:auto;" label-width="100px">
        <el-form-item label="教师编号" required>
          <el-input v-model="form.tid" auto-complete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="姓名" required>
          <el-input v-model="form.name" auto-complete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="form.sex" auto-complete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="年龄">
          <el-input v-model="form.age" auto-complete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="院系">
          <el-input v-model="form.dname" auto-complete="off" style="width:50%"></el-input>
        </el-form-item>
        <div id="dialogfooter" style="width:100%">
          <div style="margin-left:200px">
            <el-button type="primary" @click="postInfos">确定</el-button>
            <el-button @click="dialogFormVisible=false">取消</el-button>
          </div>
        </div>
      </el-form>
    </el-dialog>
    <Page
      :total="page.dataLength"
      :page-size="page.size"
      :current="page.index"
      show-sizer
      show-elevator
      @on-change="changePage"
    />
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "teacherinfo",
  data() {
    return {
      page: {
        size: "",
        dataLength: "",
        index: ""
      },
      tabledata: Array,
      keyword: "",
      form: {
        tid: "",
        name: "",
        sex: "",
        age: "",
        dname: ""
      },
      dialogFormVisible: false,
      titleMap: {
        addTeacher: "添加教师",
        editTeacher: "修改信息"
      },
      //弹窗动态标题
      dialogStatus: ""
    };
  },
  methods: {
    getData() {
      axios({
        //   http://211.87.231.59:8080/teacher/getByPage?page=1
        url: "/api/teacher/search?pageNum=" + this.page.index,
        method: "get",
        params: {},
        headers: {
          "Content-type": "application/x-www-form-urlencoded"
        }
      })
        .then(res => {
          console.log(res);
          //   取数据
          this.tabledata = res.content;
          //   取页面大小
          this.page.size = res.size;
          //   数据总长度
          this.page.dataLength = res.totalElements;
        })
        .catch(error => {
          console.log(error);
        });
    },
    changePage(val) {
      console.log(val);
      var _this = this;
      _this.page.index = val;
      //   console.log(_this.page.index);
      _this.getData();
    },
    deleteTch(index, row) {
      this.$confirm("此操作不可恢复, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          axios({
            method: "get",
            url: "/api/teacher/deleteById?tid=" + row.tid,
            params: {
              // sid: row.sid
            },
            headers: {
              "Content-type": "application/x-www-form-urlencoded"
            }
          })
            .then(res => {
              console.log(res);
              this.getData();
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    updateTch(index, row) {
      this.dialogStatus = "editTeacher";
      this.form.tid = row.tid;
      this.form.name = row.name;
      this.form.sex = row.sex;
      this.form.age = row.age;
      this.form.dname = row.dname;
      this.dialogFormVisible = true;
    },
    addTeacher() {
      this.form.tid = "";
      this.form.name = "";
      this.form.sex = "";
      this.form.age = "";
      this.form.dname = "";
      this.dialogFormVisible = true;
      this.dialogStatus = "addTeacher";
    },
    postInfos() {
      this.dialogFormVisible = false;
      if (this.dialogStatus === "addTeacher") {
        axios({
          url: "/api/teacher/insert",
          // url: "/student/insert",
          method: "post",
          params: {
            tid: this.form.tid,
            name: this.form.name,
            sex: this.form.sex,
            age: this.form.age,
            dname: this.form.dname
          },
          headers: {
            "Content-type": "application/x-www-form-urlencoded"
          }
        })
          .then(res => {
            // console.log(res);
            // this.$message("插入成功");
            if (res) {
              // success
              this.$message({
                message: "新增成功",
                type: "success"
              });
              this.getData();
            } else {
              this.$message.error("新增失败");
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else if (this.dialogStatus === "editTeacher") {
        axios({
          url: "/api/teacher/update",
          method: "post",
          params: {
            tid: this.form.tid,
            name: this.form.name,
            sex: this.form.sex,
            age: this.form.age,
            dname: this.form.dname
          },
          headers: {
            "Content-type": "application/x-www-form-urlencoded"
          }
        })
          .then(res => {
            console.log(res);
            let _this = this;
            _this.getData();
          })
          .catch(error => {
            console.log(error);
          });
      }
    },

    searchByKeyword() {
      // console.log(this.keyword);
      var _this = this;
      _this.page.index = 1;
      if (_this.keyword.length == 6) {
        axios({
          url: "/api/teacher/searchById?id=" + this.keyword,
          method: "get",
          params: {},
          headers: {
            "Content-type": "application/x-www-form-urlencoded"
          }
        })
          .then(res => {
            let tmpArray = [];
            tmpArray.push(res);
            _this.tabledata = tmpArray;
            _this.page.size = 10;
            _this.page.dataLength = 1;
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        // 通过姓名查询
        console.log("通过姓名查询");
        axios({
          url: "/api/teacher/searchByName?name=" + this.keyword,
          method: "get",
          params: {},
          headers: {
            "Content-type": "application/x-www-form-urlencoded"
          }
        })
          .then(res => {
            let tmpArray = [];
            tmpArray.push(res[0]);
            _this.tabledata = tmpArray;
            _this.page.size = 10;
            _this.page.dataLength = 1;
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  },
  created() {
    this.page.index = 1;
    this.getData();
  }
};
</script>

<style scoped>
</style>