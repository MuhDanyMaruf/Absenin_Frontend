import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";

const routes = [
  // 1. RUTE OTENTIKASI (Static Import - Langsung Dimuat)
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: LoginView,
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterView,
  },

  // 2. RUTE DASHBOARD (Dynamic Import - Hanya Dimuat Saat Ditinggali / Anti-Bentrok)
  {
    path: "/dashboard/siswa",
    name: "StudentDashboard",
    component: () => import("../views/dashboards/StudentDashboard.vue"),
  },
  {
    path: "/dashboard/guru",
    name: "TeacherDashboard",
    component: () => import("../views/dashboards/TeacherDashboard.vue"),
  },
  {
    path: "/dashboard/admin",
    name: "AdminDashboard",
    component: () => import("../views/dashboards/AdminDashboard.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
