<template>
  <el-card class="box-card" style="width:90%">
    <div slot="header" class="clearfix">
      <span>平均分最高的课程Top10</span>
      <!-- <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button> -->
    </div>
    <div v-for="(iter,i) in courseList" class="text item">
      <!-- <i v-if="i+1==1" class="el-icon-medal-1"></i> -->
      <span class="toptext" style="margin-right:8px">Top{{i+1}}</span>
      <span style="margin-right:8px">{{iter.cid}}</span>
      <span>{{iter.name}}</span>
      <span style="float:right">{{iter.stucnt}}</span>
      <span style="float:right">{{iter.avgscore}}</span>
    </div>
    <div ref="chart" style="width:300px;height:300px;margin:auto;"></div>
  </el-card>
</template>

<script>
import axios from "axios";
export default {
  name: "statisticcardone",
  data() {
    return {
      courseList: Array,
      cnameList: [],
      avgscore: []
    };
  },
  methods: {
    drawGraph() {
      let mychart = this.$echarts.init(this.$refs.chart);
      // 动画
      mychart.setOption({
        title: { text: "选课人数最多的10门课" },
        tooltip: {},
        xAxis: [
          {
            // type: "category",
            // 若需要动态数据，则需要异步加载
            data: []
          }
        ],
        yAxis: [
          {
            type: "value",
            max: 150,
            min: 110
          }
        ],
        series: [
          {
            name: "平均分",
            type: "bar",
            data: []
          }
        ]
      });
      mychart.showLoading();
      // 加载数据
      axios({
        url: "/api/sc/statisticTopNAvg",
        method: "get",
        params: {},
        headers: {
          "Content-type": "application/x-www-form-urlencoded"
        }
      })
        .then(res => {
          console.log(res);
          this.courseList = res;
          for (let i = 0; i < res.length; i++) {
            this.cnameList.push(res[i].name);
            this.avgscore.push(res[i].avgscore);
          }

          mychart.hideLoading();
          mychart.setOption({
            xAxis: [
              {
                data: this.cnameList
              }
            ],
            series: [
              {
                data: this.avgscore
              }
            ]
          });
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  mounted() {
    this.drawGraph();
  }
};
</script>

<style scoped>
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}
.toptext {
  color: white;
  font-weight: bold;
  text-shadow: -1px 0 #00b2ee, 0 1px #00b2ee, 1px 0 #00b2ee, 0 -1px #00b2ee;
}
</style>
