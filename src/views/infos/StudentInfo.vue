<template>
  <div class="overflow: auto">
    <div class="query-c" style="width:800px;">
      查询：
      <Input
        search
        placeholder="请输入姓名或学号进行查询"
        style="width: 300px"
        v-model="keyword"
        @on-search="searchByKeyword()"
      />
      <el-button type="primary" round style="float:right" @click="addStudent">添加学生</el-button>
    </div>
    <br />
    <template>
      <el-table :data="tabledata" stripe style="width: 100%">
        <el-table-column label="学号" prop="sid" width="150"></el-table-column>
        <el-table-column label="姓名" prop="name" width="100"></el-table-column>
        <el-table-column label="性别" prop="sex" width="100"></el-table-column>
        <el-table-column label="年龄" prop="age" width="100"></el-table-column>
        <el-table-column label="生日" prop="birthday" width="100"></el-table-column>
        <el-table-column label="院系" prop="dname" width="100"></el-table-column>
        <el-table-column label="年级" prop="stuClass" width="100"></el-table-column>
        <el-table-column label="操作" width="150">
          <!-- 修改 -->
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="updateStu(scope.$index,scope.row)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteStu(scope.$index,scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <br />
    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form" style="width:500px;margin:auto;" label-width="100px">
        <el-form-item label="学号" required>
          <el-input v-model="form.sid" auto-complete="off" style="width:50%"></el-input>
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
        <el-form-item label="生日">
          <div class="block" style="width:50%">
            <el-date-picker v-model="form.birthday" type="date" placeholder="选择日期"></el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="院系">
          <el-input v-model="form.dname" auto-complete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="年级">
          <el-input v-model="form.stuClass" auto-complete="off" style="width:50%"></el-input>
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
  name: "studentinfo",
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
        sid: "",
        name: "",
        sex: "",
        age: "",
        birthday: Date,
        dname: "",
        stuClass: ""
      },
      dialogFormVisible: false,
      titleMap: {
        addStudent: "添加学生",
        editStudent: "修改信息"
      },
      //弹窗动态标题
      dialogStatus: ""
    };
  },
  methods: {
    getData() {
      //   console.log(this.page);
      axios({
        url: "/api/student/search?pageNum=" + this.page.index,
        method: "get",
        params: {},
        headers: {
          "Content-type": "application/x-www-form-urlencoded"
        }
      })
        .then(res => {
          // console.log(res);
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
    deleteStu(index, row) {
      // console.log(index, row);
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
            url: "/api/student/deleteById?sid=" + row.sid,
            // url: "/student/deleteById?sid=" + row.sid,
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
    updateStu(index, row) {
      // console.log(index, row);
      this.dialogStatus = "editStudent";
      this.form.sid = row.sid;
      this.form.name = row.name;
      this.form.sex = row.sex;
      this.form.age = row.age;
      this.form.birthday = row.birthday;
      this.form.dname = row.dname;
      this.form.stuClass = row.stuClass;
      this.dialogFormVisible = true;
    },
    searchByKeyword() {
      // console.log(this.keyword);
      var _this = this;
      _this.page.index = 1;
      if (_this.keyword.length == 12) {
        //通过学号查询
        console.log("通过学号查询");
        axios({
          url: "/api/student/searchBySid?sid=" + this.keyword,
          // url: "/student/searchBySid?sid=" + this.keyword,
          method: "get",
          params: {},
          headers: {
            "Content-type": "application/x-www-form-urlencoded"
          }
        })
          .then(res => {
            console.log(res);
            let tmpArray = [];
            tmpArray.push(res);
            _this.tabledata = tmpArray;
            console.log(_this.tabledata);
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
          url: "/api/student/searchByName?name=" + this.keyword,
          method: "get",
          params: {},
          headers: {
            "Content-type": "application/x-www-form-urlencoded"
          }
        })
          .then(res => {
            let tmpArray = [];
            console.log(res);
            tmpArray.push(res[0]);
            _this.tabledata = tmpArray;
            console.log(_this.tabledata);
            _this.page.size = 10;
            _this.page.dataLength = 1;
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    addStudent() {
      this.form.sid = "";
      this.form.name = "";
      this.form.sex = "";
      this.form.age = "";
      this.form.birthday = "";
      this.form.dname = "";
      this.form.stuClass = "";
      // console.log("add student");
      this.dialogFormVisible = true;
      this.dialogStatus = "addStudent";
    },
    postInfos() {
      this.dialogFormVisible = false;
      if (this.dialogStatus === "addStudent") {
        axios({
          // http://211.87.231.59:8080/student/save
          url: "/api/student/insert",
          // url: "/student/insert",
          method: "post",
          params: {
            sid: this.form.sid,
            name: this.form.name,
            sex: this.form.sex,
            age: this.form.age,
            birthday: this.form.birthday,
            dname: this.form.dname,
            stuClass: this.form.stuClass
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
              this.getData();
            } else {
              this.$message.error("新增失败");
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else if (this.dialogStatus === "editStudent") {
        axios({
          // http://211.87.231.59:8080/student/save
          url: "/api/student/update",
          method: "post",
          params: {
            sid: this.form.sid,
            name: this.form.name,
            sex: this.form.sex,
            age: this.form.age,
            birthday: this.form.birthday,
            dname: this.form.dname,
            stuClass: this.form.stuClass
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