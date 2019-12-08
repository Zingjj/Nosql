<template>
  <div class="overflow: auto">
    <div class="query-c" style="width:800px;">
      查询：
      <Input placeholder="请输入学号" style="width: 500px" v-model="keyword">
        <!-- 具名slot -->
        <Select v-model="searchType" slot="prepend" style="width:150px">
          <Option value="bySid">按学号查询</Option>
          <Option value="byCid">按课程编号查询</Option>
        </Select>
        <Button slot="append" icon="ios-search" @click="search"></Button>
      </Input>
    </div>
    <br />
    <template>
      <el-table :data="tabledata" stripe style="width: 100%">
        <el-table-column label="学号" prop="sid" width="200"></el-table-column>
        <el-table-column label="课程编号" prop="cid" width="150"></el-table-column>
        <el-table-column label="成绩" prop="score" width="100"></el-table-column>
        <el-table-column label="教师编号" prop="tid" width="150"></el-table-column>
      </el-table>
    </template>
    <br />
    <!-- <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
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
    </el-dialog>-->
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
  name: "stucrs",
  data() {
    return {
      page: {
        size: "",
        dataLength: "",
        index: ""
      },
      tabledata: Array,
      keyword: "",
      dialogFormVisible: false,
      titleMap: {
        addStudent: "添加学生",
        editStudent: "修改信息"
      },
      //弹窗动态标题
      dialogStatus: "",
      searchType: "bySid" // 默认按学号查询
    };
  },
  methods: {
    getData() {
      //   console.log(this.page);
      axios({
        url: "/api/sc/search?pageNum=" + this.page.index,
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
      _this.search();
    },
    // deleteStu(index, row) {
    //   // console.log(index, row);
    //   this.$confirm("此操作不可恢复, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       this.$message({
    //         type: "success",
    //         message: "删除成功!"
    //       });
    //       axios({
    //         method: "get",
    //         url: "/api/student/deleteById?sid=" + row.sid,
    //         // url: "/student/deleteById?sid=" + row.sid,
    //         params: {
    //           // sid: row.sid
    //         },
    //         headers: {
    //           "Content-type": "application/x-www-form-urlencoded"
    //         }
    //       })
    //         .then(res => {
    //           console.log(res);
    //           this.getData();
    //         })
    //         .catch(error => {
    //           console.log(error);
    //         });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消删除"
    //       });
    //     });
    // },
    // updateStu(index, row) {
    //   // console.log(index, row);
    //   this.dialogStatus = "editStudent";
    //   this.form.sid = row.sid;
    //   this.form.name = row.name;
    //   this.form.sex = row.sex;
    //   this.form.age = row.age;
    //   this.form.birthday = row.birthday;
    //   this.form.dname = row.dname;
    //   this.form.stuClass = row.stuClass;
    //   this.dialogFormVisible = true;
    // },
    search() {
      console.log(this.searchType);
      if (this.searchType === "bySid") {
        // 按学号查询
        if (this.keyword.length == 12) {
          axios({
            url:
              "/api/sc/findBySid?sid=" +
              this.keyword +
              "&pageNum=" +
              this.page.index,
            method: "get",
            params: {},
            headers: {
              "Content-type": "application/x-www-form-urlencoded"
            }
          })
            .then(res => {
              console.log(res);
              this.tabledata = res.content;
              this.page.size = res.size;
              this.page.dataLength = res.totalElements;
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          alert("输入学号有误");
        }
      } else if (this.searchType === "byCid") {
        // 按课程编号查询
        if (this.keyword.length == 6) {
          axios({
            url:
              "/api/sc/findByCid?cid=" +
              this.keyword +
              "&pageNum=" +
              this.page.index,
            method: "get",
            params: {},
            headers: {
              "Content-type": "application/x-www-form-urlencoded"
            }
          })
            .then(res => {
              console.log(res);
              this.tabledata = res.content;
              this.page.size = res.size;
              this.page.dataLength = res.totalElements;
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          alert("输入课程编号有误");
        }
      }
    }
    // addStudent() {
    //   this.form.sid = "";
    //   this.form.name = "";
    //   this.form.sex = "";
    //   this.form.age = "";
    //   this.form.birthday = "";
    //   this.form.dname = "";
    //   this.form.stuClass = "";
    //   // console.log("add student");
    //   this.dialogFormVisible = true;
    //   this.dialogStatus = "addStudent";
    // },
    // postInfos() {
    //   this.dialogFormVisible = false;
    //   if (this.dialogStatus === "addStudent") {
    //     axios({
    //       // http://211.87.231.59:8080/student/save
    //       url: "/api/student/insert",
    //       // url: "/student/insert",
    //       method: "post",
    //       params: {
    //         sid: this.form.sid,
    //         name: this.form.name,
    //         sex: this.form.sex,
    //         age: this.form.age,
    //         birthday: this.form.birthday,
    //         dname: this.form.dname,
    //         stuClass: this.form.stuClass
    //       },
    //       headers: {
    //         "Content-type": "application/x-www-form-urlencoded"
    //       }
    //     })
    //       .then(res => {
    //         console.log(res);
    //         // this.$message("插入成功");
    //         if (res) {
    //           // success
    //           this.$message({
    //             message: "新增成功",
    //             type: "success"
    //           });
    //           this.getData();
    //         } else {
    //           this.$message.error("新增失败");
    //         }
    //       })
    //       .catch(error => {
    //         console.log(error);
    //       });
    //   } else if (this.dialogStatus === "editStudent") {
    //     axios({
    //       // http://211.87.231.59:8080/student/save
    //       url: "/api/student/update",
    //       method: "post",
    //       params: {
    //         sid: this.form.sid,
    //         name: this.form.name,
    //         sex: this.form.sex,
    //         age: this.form.age,
    //         birthday: this.form.birthday,
    //         dname: this.form.dname,
    //         stuClass: this.form.stuClass
    //       },
    //       headers: {
    //         "Content-type": "application/x-www-form-urlencoded"
    //       }
    //     })
    //       .then(res => {
    //         console.log(res);
    //         let _this = this;
    //         _this.getData();
    //       })
    //       .catch(error => {
    //         console.log(error);
    //       });
    //   }
    // }
  },
  created() {
    this.page.index = 1;
    this.getData();
  }
};
</script>

<style scoped>
</style>