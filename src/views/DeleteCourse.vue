<template>
  <div class="overflow: auto">
    <div class="query-c" style="width:800px;margin:auto;padding-top:50px">
      <Input placeholder="请输入学号" style="width: 400px;" v-model.lazy="inputSid">
        <Icon type="ios-contact" slot="prefix" />
      </Input>
      <Button @click="getData">查看选课</Button>
    </div>
    <br />
    <template>
      <el-row :gutter="10">
        <div style="width:900px;margin:auto;">
          <el-table :data="tabledata" stripe>
            <el-table-column label="学号" prop="sid" width="200"></el-table-column>
            <el-table-column label="课程编号" prop="cid" width="150"></el-table-column>
            <el-table-column label="成绩" prop="score" width="100"></el-table-column>
            <el-table-column label="教师编号" prop="tid" width="150"></el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <!-- 删除 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="deleteCourse(scope.$index,scope.row)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-row>
    </template>
    <br />
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
  name: "deletecourse",
  data() {
    return {
      tabledata: Array,
      inputSid: "",
      page: {
        size: "",
        dataLength: "",
        index: ""
      }
    };
  },
  methods: {
    getData() {
      //   console.log(this.page);
      axios({
        // /course/getCourseByPage
        url:
          "/api/sc/findBySid?sid=" +
          this.inputSid +
          "&pageNum=" +
          this.page.index,
        method: "get",
        params: {},
        headers: {
          "Content-type": "application/x-www-form-urlencoded"
        }
      })
        .then(res => {
          this.tabledata = res.content;
          this.page.size = res.size;
          this.page.dataLength = res.totalElements;
        })
        .catch(error => {
          console.log(error);
        });
    },
    deleteCourse(index, row) {
      this.$confirm("是否确定退课?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          axios({
            method: "get",
            url: "/api/sc/deleteBySidCid?sid=" + row.sid + "&cid=" + row.cid,
            // url: "/student/deleteById?sid=" + row.sid,
            params: {
              // sid: row.sid
            },
            headers: {
              "Content-type": "application/x-www-form-urlencoded"
            }
          })
            .then(res => {
              this.$message({
                type: "success",
                message: "退课成功!"
              });
              this.getData();
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退课"
          });
        });
    },
    changePage(val) {
      var _this = this;
      _this.page.index = val;
      //   console.log(_this.page.index);
      _this.getData();
    }
  },
  created() {
    this.page.index = 1;
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