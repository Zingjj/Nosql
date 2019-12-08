<template>
  <div class="overflow: auto">
    <div class="query-c" style="width:800px">
      查询：
      <Input
        search
        placeholder="请输入关键词进行查询"
        style="width: 300px"
        v-model="keyword"
        @on-search="searchByKeyword()"
      />
      <el-button type="primary" round style="float:right" @click="addCourse">添加课程</el-button>
    </div>
    <br />
    <!-- <Table border stripe :columns="cols" :data="tabledata"></Table> -->
    <template>
      <el-table :data="tabledata" stripe style="width: 100%">
        <el-table-column label="课程编号" prop="cid" width="200"></el-table-column>
        <el-table-column label="课程名称" prop="name" width="200"></el-table-column>
        <el-table-column label="先导课" prop="fcid" width="200"></el-table-column>
        <el-table-column label="学分" prop="credit" width="200"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              circle
              @click="updateCor(scope.$index,scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              @click="deleteCor(scope.$index,scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <br />
    <el-dialog :title="titleMap[dialogStatus]" :visible.sync="dialogFormVisible" width="30%">
      <el-form :model="form" style="width:500px;margin:auto;" label-width="100px">
        <el-form-item label="课程编号" required>
          <el-input v-model="form.cid" auto-complete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="课程名" required>
          <el-input v-model="form.name" auto-complete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="先导课">
          <el-input v-model="form.fcid" auto-complete="off" style="width:50%"></el-input>
        </el-form-item>
        <el-form-item label="学分">
          <el-input v-model="form.credit" auto-complete="off" style="width:50%"></el-input>
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
  name: "courseinfo",
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
        cid: "",
        name: "",
        fcid: "",
        credit: ""
      },
      dialogFormVisible: false,
      titleMap: {
        addCourse: "添加课程",
        editCourse: "修改信息"
      },
      //弹窗动态标题
      dialogStatus: ""
    };
  },
  methods: {
    getData() {
      //   console.log(this.page);
      axios({
        // /course/getCourseByPage
        url: "/api/course/search?pageNum=" + this.page.index,
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
    deleteCor(index, row) {
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
            url: "/api/course/deleteById?cid=" + row.cid,
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
    updateCor(index, row) {
      this.dialogStatus = "editCourse";
      this.form.cid = row.cid;
      this.form.name = row.name;
      this.form.fcid = row.fcid;
      this.form.credit = row.credit;
      this.dialogFormVisible = true;
    },
    addCourse() {
      this.form.cid = "";
      this.form.name = "";
      this.form.fcid = "";
      this.form.credit = "";
      this.dialogFormVisible = true;
      this.dialogStatus = "addCourse";
    },
    postInfos() {
      this.dialogFormVisible = false;
      if (this.dialogStatus === "addCourse") {
        axios({
          url: "/api/course/insert",
          // url: "/student/insert",
          method: "post",
          params: {
            cid: this.form.cid,
            name: this.form.name,
            ficd: this.form.fcid,
            credit: this.form.credit
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
      } else if (this.dialogStatus === "editCourse") {
        axios({
          url: "/api/course/update",
          method: "post",
          params: {
            cid: this.form.cid,
            name: this.form.name,
            fcid: this.form.fcid,
            credit: this.form.credit
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
          url: "/api/course/searchById?id=" + this.keyword,
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
        axios({
          url: "/api/course/searchByName?name=" + this.keyword,
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