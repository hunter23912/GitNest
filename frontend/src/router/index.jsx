import { createBrowserRouter } from "react-router-dom";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import Search from "../pages/Search";
import Repos from "../pages/Repos";
import CreateRepo from "../pages/CreateRepo";
import RepoDetail from "../pages/RepoDetail";
import About from "../pages/About";
import NotFound from "../pages/NotFound";
import AIAssistant from "../pages/AIAssistant";
import CollaborativeEditor from "../pages/CollaborativeEditor";
import ProjectKanban from "../pages/ProjectKanban";
import CodeQuality from "../pages/CodeQuality";
import React from "react";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Home />
      </Layout>
    ),
  },
  {
    path: "/login",
    element: (
      <Layout>
        <Login />
      </Layout>
    ),
  },
  {
    path: "/register",
    element: (
      <Layout>
        <Register />
      </Layout>
    ),
  },
  {
    path: "/search",
    element: (
      <Layout>
        <Search />
      </Layout>
    ),
  },
  {
    path: "/repos",
    element: (
      <Layout>
        <Repos />
      </Layout>
    ),
  },
  {
    path: "/user/:username",
    element: (
      <Layout>
        <Profile />
      </Layout>
    ),
  },
  {
    path: "/repo/new",
    element: (
      <Layout>
        <CreateRepo />
      </Layout>
    ),
  },
  {
    path: "/repo/:username/:reponame",
    element: (
      <Layout>
        <RepoDetail />
      </Layout>
    ),
  },
  {
    path: "/repo/:username/:reponame/editor",
    element: (
      <Layout>
        <CollaborativeEditor />
      </Layout>
    ),
  },
  {
    path: "/repo/:username/:reponame/kanban",
    element: (
      <Layout>
        <ProjectKanban />
      </Layout>
    ),
  },
  {
    path: "/repo/:username/:reponame/quality",
    element: (
      <Layout>
        <CodeQuality />
      </Layout>
    ),
  },
  {
    path: "/ai-assistant",
    element: (
      <Layout>
        <AIAssistant />
      </Layout>
    ),
  },
  {
    path: "/about",
    element: (
      <Layout>
        <About />
      </Layout>
    ),
  },
  {
    path: "*",
    element: (
      <Layout>
        <NotFound />
      </Layout>
    ),
  },
]);
