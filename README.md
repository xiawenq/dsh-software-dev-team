# dsh-software-dev-team

[![powered by dsh](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)

软件开发团队智能体预设 + 自包含技能包（DeepSeek Harness / DSH 插件）。

一个 npm 包同时提供两样东西，安装即用，**不依赖任何本机路径或 link: 工作区**：

1. **Agent Preset「软件开发团队」** — 会话里出现的团队预设：交付总监·齐活林主理的七角色智能体团队（产品经理·许清楚 / 架构师·高见远 / UI·UX 设计师·陆有型 / 前端工程师·程见页 / 工程师·寇豆码 / QA 工程师·严过关；五核心常驻，设计与前端按需扩充），自带完整的插件编排（任务板、子代理、计划模式、压缩、技能系统等 22 项）。
2. **Bundled Skill `software-dev-team`** — 团队 SOP 全文（角色表、五阶段工作流、预设 Workflow、路由表、协作铁律、章程模板、六位成员的就职提示词附录），由包内 provider 直接注册，无需拷贝到 `~/.dsh/skills`。

## 安装

```bash
dsh plugin --profile web add github:xiawenq/dsh-software-dev-team
```

或手动加到 profile 依赖后 `npm install`：

```json
{
  "dependencies": {
    "dsh-software-dev-team": "github:xiawenq/dsh-software-dev-team"
  }
}
```

并在 profile 的 `package.json` 中确认 bundles 数组包含 `dsh-software-dev-team`（`dsh plugin add` 会自动加）。重启 DSH 后生效：

- 会话设置里出现「软件开发团队」预设；
- 任意会话中，模型可按描述自动调用 `software-dev-team` 技能（也可用户主动调用）。

## 使用

- 新会话选择「软件开发团队」预设，或对主理人说「以软件开发团队模式做 X」「让许清楚澄清一下需求」等触发语。
- 技能内容定义了完整 SOP：需求澄清 → 技术方案 → 并行开发 → 质量把关 → 交付，含缺陷回归循环与按需裁剪的阶段变体。

## 结构

```
dsh-software-dev-team/
├── cordis.patch.yml            # preset insert + 技能 provider 注册
├── lib/index.js                # 技能 provider（参照官方 dsh-skill-badge 模式）
├── assets/
│   └── software-dev-team.md    # 技能全文（含 frontmatter）
├── package.json                # dsh.bundle.patch 声明
├── README.md
└── LICENSE
```

## 与旧版 link: 方案的差别

旧方案把 preset bundle 放在远程工作区镜像目录里，用 npm `link:` 指向它，技能还要单独拷贝到 `~/.dsh/skills`——换机器或换工作区路径就断。本包把 preset 和技能合成一个自包含 npm 包，从 GitHub 直接安装即可，任何机器一致。

## License

MIT
