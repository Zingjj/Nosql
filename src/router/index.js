import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const commonRoutes = [
    {
        path: '/login',
        name: 'login',
        component: () => import('../components/Login.vue')
    },
    { path: '/', redirect: '/home' },
]

// 需要通过后台数据来生成的组件
export const asyncRoutes = {
    'home': {
        path: 'home',
        name: 'home',
        component: () => import('../views/Home.vue')
    },
    'password': {
        path: 'password',
        name: 'password',
        component: () => import('../views/Password.vue')
    },
    'msg': {
        path: 'msg',
        name: 'msg',
        component: () => import('../views/Msg.vue')
    },
    'userinfo': {
        path: 'userinfo',
        name: 'userinfo',
        component: () => import('../views/UserInfo.vue')
    },
    'courseinfo': {
        path: 'courseinfo',
        name: 'courseinfo',
        component: () => import('../views/infos/CourseInfo.vue')
    },
    'studentinfo': {
        path: 'studentinfo',
        name: 'studentinfo',
        component: () => import('../views/infos/StudentInfo.vue')
    },
    'teacherinfo': {
        path: 'teacherinfo',
        name: 'teacherinfo',
        component: () => import('../views/infos/TeacherInfo.vue')
    },
    'stucrs': {
        path: 'stucrs',
        name: 'stucrs',
        component: () => import('../views/infos/StudentCourse.vue')
    },
    'selectcourse': {
        path: 'selectcourse',
        name: 'selectcourse',
        component: () => import('../views/SelectCourse.vue')
    },
    'deletecourse': {
        path: 'deletecourse',
        name: 'deletecourse',
        component: () => import('../views/DeleteCourse.vue')
    },
    'statistics': {
        path: 'statistics',
        name: 'statistics',
        component: () => import('../views/Statistics.vue')
    }
}

const createRouter = () => new Router({
    routes: commonRoutes
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher
}

export default router