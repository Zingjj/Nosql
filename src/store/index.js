import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        // 左侧菜单栏数据
        menuItems: [
            {
                name: 'home', // 要跳转的路由名称 不是路径
                size: 18, // icon大小
                type: 'md-home', // icon类型
                text: '主页', // 文本内容
            },
            {
                text: '基本信息',
                type: 'ios-paper',
                children: [
                    {
                        text: '学生',
                        type: 'ios-paper',
                        children: [
                            {
                                type: 'md-person',
                                name: 'studentinfo',
                                text: '基本资料',
                            },
                            {
                                type: 'md-lock',
                                name: 'password',
                                text: '密码管理'
                            }
                        ]
                    },
                    {
                        text: '教师',
                        type: 'ios-paper',
                        children: [
                            {
                                type: 'md-person',
                                name: 'teacherinfo',
                                text: '基本资料',
                            },
                            {
                                type: 'md-lock',
                                name: 'password',
                                text: '密码管理'
                            }
                        ]
                    },
                    {
                        text: '课程',
                        type: 'ios-paper',
                        name: 'courseinfo'
                    }
                ]
            },
            {
                text: '选课情况',
                type: 'ios-paper',
                children: [
                    {
                        text: '学生',
                        type: 'ios-paper',
                        name: 'stucrs'
                    },
                    {
                        text: '教师',
                        type: 'ios-paper'
                        // name:
                    }
                ]
            },
            {
                text: '学生选课',
                type: 'ios-paper',
                children: [
                    {
                        type: 'ios-grid',
                        name: 'selectcourse',
                        text: '选课'
                    },
                    {
                        text: '退课',
                        type: 'ios-paper',
                        name: 'deletecourse'
                    }
                ]
            },
            {
                text: '统计数据',
                type: 'ios-paper',
                name: 'statistics'
            }
        ],
    },
    mutations: {
        setMenus(state, items) {
            state.menuItems = [...items]
        },
    }
})

export default store