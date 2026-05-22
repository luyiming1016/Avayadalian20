/* ============================================================
 *  Avaya Dalian 20 Years — Backbone 传奇
 *  content.js  ·  全部剧本数据（9 年 + 终章 + 尾声 + 7+1 结局）
 *  事件结构：
 *  { id, beat, title, scene, emoji, body[], choices[] }
 *  body 元素类型：narr / p / dialog{who,text} / quote / mail{from,sub,body} / im{who,text}
 *  choice 效果键：tech/comm/stam/eq/en/res/hp/money/family/legend/father
 *                 cruce/david/laok/frank/eric/spouse  (关系)
 *                 flag{set:"xxx"}   log:"..."  next:"id" 可选跳转
 * ============================================================ */

const CONTENT = {
  /* =================================================================
   * 9 年事件
   * ================================================================= */
  years: [

    /* ============ 2018 ============ */
    {
      year: 2018, title: "工牌、单人床、外卖箱", subtitle: "菜鸟入海",
      siteHeadcount: 100,
      events: [
        {
          id: "y18-1", beat: "节点 1 · 入职报到", title: "1月2日 · 推门进入会议室",
          scene: "lobby", emoji: "🏢",
          body: [
            {type:"narr", text:"2018-01-02 周二 · 大连软件园 15 号楼大堂。前台核验工卡照片，玻璃门外的雪没化，地铁报站声混着电梯叮咚一起钻进耳朵。"},
            {type:"p", text:"3 楼会议室。HR 把一张烫金工牌推到你面前，照片里的你比现在还瘦。门外有人敲了两下，推门进来一个 35 岁上下、戴方框眼镜的男人，左手拎着保温杯，右手伸过来。"},
            {type:"dialog", who:"David Liu（你的 Manager）", text:"欢迎，Backbone 这边人不多，但 case 一来都是真家伙。今天先认认人，下周一开始上手。"},
            {type:"p", text:"他身后跟着一个穿灰色卫衣、看起来 30 岁出头、笑得很温和的男人——胸卡写着 <b>Cruce · L20 Team Lead</b>。Cruce 不是你的直属，但他主动把你拉到走廊，指着对面那排开放工位说：「桌上那台旧 J169 是你的，老 K 会带你头三个月。这地方水不深，但风很硬，别一个人扛。」"}
          ],
          choices: [
            {label:"礼貌握手 + 简短自我介绍", tag:"EQ", sub:"得体，但不会让人记住",
              effects:{comm:2, david:3, cruce:5}, log:"入职报到 · 礼貌型"},
            {label:"主动把 Cruce 加进手机微信", tag:"cruce", sub:"种下整条 Cruce 线的种子",
              effects:{comm:1, cruce:10, flag:{set:"cruce_wechat"}}, log:"主动加了 Cruce 微信"},
            {label:"对 David 直接表态「我想三年内做到 L15」", tag:"legend", sub:"野心可嘉，Manager 印象两极",
              effects:{eq:-1, david:5, legend:2}, log:"开场就立 flag：三年 L15"}
          ]
        },
        {
          id: "y18-2", beat:null, title:"4月 · 第一次值夜班",
          scene:"convenience", emoji:"🥤",
          body:[
            {type:"narr", text:"凌晨 2 点的软件园便利店，关东煮咕嘟咕嘟。手机里 PagerDuty 在响第三遍，是个 BI——医院客户的某台电话机注册不上。"},
            {type:"p", text:"老 K 在群里发了一条 60 秒语音：「不急，先看 station 状态，别一上来就 restart。」他人在家里，但语气像在你旁边坐着。"},
            {type:"im", who:"Cruce → 你（凌晨 2:14）", text:"小伙子你的第一夜班。记住一个事：你救的不是机器，是凌晨 3 点还在等你回电话的那个人。"}
          ],
          choices:[
            {label:"按老 K 的方法稳步排查，不重启", tag:"EQ", sub:"耗时 1 小时，但客户感谢",
              effects:{tech:3, stam:-10, david:2, log:"夜班稳健解 BI"}},
            {label:"直接重启 station，30 分钟回家睡觉", tag:"danger", sub:"快，但被老 K 记一笔",
              effects:{tech:1, stam:-5, laok:-3, log:"夜班重启了事"}},
            {label:"把 case 转给 EMEA Follow-the-Sun", tag:"EQ", sub:"自己保住觉，handover note 要写好",
              effects:{stam:0, en:1, eric:5, log:"第一次 handover 给 EMEA"}}
          ]
        },
        {
          id:"y18-3", beat:null, title:"7月 · 金石滩团建",
          scene:"goldstone", emoji:"🌊",
          body:[
            {type:"narr", text:"部门第一次大团建，包车去金石滩。海风很咸，烧烤摊摆在沙滩上。David 喝了点啤酒难得放松；Cruce 拉你坐在最靠海的那张桌。"},
            {type:"dialog", who:"Cruce", text:"和你说个事——我和 David 不在一条线上。你日常听他的，私下听你心里的。听不懂的时候来问我。"},
            {type:"p", text:"远处小赵在和老 K 比划新出的 SBC 命令。海浪拍着礁石，你忽然觉得：这地方，好像可以待几年。"}
          ],
          choices:[
            {label:"敬 David 一杯 + 表态愿意接更多活", tag:"EQ", sub:"Manager 印象 +，但传到 Cruce 耳朵里",
              effects:{eq:1, david:6, cruce:-2, log:"团建主动敬 Manager"}},
            {label:"和 Cruce 喝大酒，掏心窝", tag:"cruce", sub:"Cruce 线 +，但隔天宿醉",
              effects:{cruce:10, stam:-15, log:"和 Cruce 喝到走不动"}},
            {label:"和老 K + 小赵聊技术", tag:"legend", sub:"低调但稳",
              effects:{tech:3, laok:5, log:"团建上听老 K 讲 CM 命令"}}
          ]
        },
        {
          id:"y18-4", beat:"节点 2 · 转正", title:"8月 · 试用期 1:1",
          scene:"conference", emoji:"📋",
          body:[
            {type:"narr", text:"David 把你叫到 4 楼最小的会议室，关门。他翻开笔记本电脑，屏幕没朝你。"},
            {type:"dialog", who:"David", text:"……正式跟你说一下：试用期通过，下个月开始 L13，工资单本月底就改。这半年你不算亮眼，但稳，老 K 也愿意带你。"},
            {type:"p", text:"他停了一下，把杯子推到你面前一点。"},
            {type:"dialog", who:"David", text:"我只问一件事：你打算待几年？"}
          ],
          choices:[
            {label:"「三年，把 L15 拿到」", tag:"legend", sub:"David 信任 ++",
              effects:{david:10, legend:3, log:"转正 · 立三年 L15 的 flag"}},
            {label:"「先一年看看，看团队，也看自己」", tag:"EQ", sub:"诚实，Manager 微微皱眉",
              effects:{eq:2, david:2, log:"转正 · 给了诚实回答"}},
            {label:"「我想做技术线最深的那个」", tag:"legend", sub:"技术力起手 +",
              effects:{tech:3, david:5, legend:2, log:"转正 · 立技术线 flag"}}
          ]
        }
      ],
      review: {
        quote:"工牌、单人床、外卖箱——你成了软件园 15 号楼里多出来的一只灯。",
        grade:"L13"
      }
    },

    /* ============ 2019 ============ */
    {
      year:2019, title:"滨海路上的两杯咖啡", subtitle:"站稳脚跟 · 心动初萌",
      siteHeadcount:100,
      events:[
        {
          id:"y19-1", beat:"节点 3 · 第一次独立 OUG", title:"Q2 · 凌晨 3 点的金融客户",
          scene:"warroom", emoji:"🔥",
          body:[
            {type:"narr", text:"凌晨 02:47，PagerDuty 响成催魂铃。Bank-11 主 CM 心跳断开，分行 8000 个分机静音；老 K 不在线，群里只有你和印度 Rohan 在敲字。"},
            {type:"mail", from:"Bank-11 IT Director", sub:"URGENT - All branch phones down",
              body:"All 8000 extensions silent since 02:31. Lobby cards declined - branches opening in 4 hours. We need a fix or a clean rollback path, NOW."},
            {type:"p", text:"屏幕上 traceSM 已经跑出第一段，看上去像是 SM 与 CM 之间的 H.323 link flap，但根因还不明。"}
          ],
          choices:[
            {label:"沉住气，按 traceSM 一段一段抠到根因再动手", tag:"legend", sub:"漂亮闭环 · 永久写入传奇分",
              effects:{tech:5, stam:-25, res:3, legend:8, david:8, log:"首次独立 OUG · 漂亮闭环"}},
            {label:"先 fail-over 到备 CM，回头慢慢分析", tag:"EQ", sub:"勉强闭环 · 客户暂时满意",
              effects:{tech:2, stam:-15, david:4, legend:3, log:"首次独立 OUG · 勉强闭环"}},
            {label:"打电话把老 K 从被窝里拽起来", tag:"danger", sub:"被救场 · 自己留下心结",
              effects:{tech:1, stam:-10, laok:-2, david:-2, log:"首次独立 OUG · 老 K 救场"}}
          ]
        },
        {
          id:"y19-2", beat:null, title:"Q3 · EMEA 的 Eric",
          scene:"desk", emoji:"🌍",
          body:[
            {type:"narr", text:"布拉格的 Eric 给你发了一封长邮件，handover 写得像散文：每个 case 的当前状态、客户脾气、下一个 ping window，全部列得整整齐齐。"},
            {type:"im", who:"Eric (Praha)", text:"Hey friend, I noticed your handover notes are getting better. Want to swap one of mine into yours next Friday? Less ping-pong that way."}
          ],
          choices:[
            {label:"接，并主动写一份模板回送他", tag:"legend", sub:"跨时区盟友达成",
              effects:{en:3, comm:2, eric:15, legend:2, log:"和 Eric 互换 handover 模板"}},
            {label:"先接一周看看", tag:"EQ", sub:"稳，但缺一点诚意",
              effects:{en:1, eric:6, log:"接了 Eric 一周的 handover"}},
            {label:"拒绝——自己单都做不完", tag:"danger", sub:"短期省力，长期跨团队差",
              effects:{eric:-8, log:"拒绝了 Eric 的 handover 邀约"}}
          ]
        },
        {
          id:"y19-3", beat:"节点 4 · 遇见", title:"Q4 · 那个人",
          scene:"cafe", emoji:"☕",
          body:[
            {type:"narr", text:"周六下午 4 点，软件园对面的一家小咖啡馆。窗外的银杏叶刚黄。你点完单转身，差点撞到她/他端着拿铁的手。"},
            {type:"p", text:"——这就是你后来很多年回忆里反复出现的那一秒。"}
          ],
          choices:[
            {label:"同事介绍 · Sarah（隔壁部门 SE）", sub:"行业懂你，但同公司风险",
              effects:{spouse:15, comm:1, flag:{set:"spouse_sarah"}}, log:"邂逅 · Sarah"},
            {label:"咖啡馆偶遇 · 夏可（自由设计师）", sub:"浪漫，节奏差异大",
              effects:{spouse:15, eq:1, flag:{set:"spouse_xiake"}}, log:"邂逅 · 夏可"},
            {label:"健身房 · 林一（医院护士）", sub:"共情你的夜班",
              effects:{spouse:15, hp:2, flag:{set:"spouse_linyi"}}, log:"邂逅 · 林一"},
            {label:"相亲 · 周婷（事业单位）", sub:"父母满意，务实",
              effects:{spouse:12, money:0, flag:{set:"spouse_zhouting"}}, log:"邂逅 · 周婷"}
          ]
        },
        {
          id:"y19-4", beat:null, title:"12月 · 年会 · 新人进步奖",
          scene:"party", emoji:"🏆",
          body:[
            {type:"narr", text:"年会场地选在富丽华，台上抽奖，台下大家把「最佳救火奖」拍给了老 K——意料之中。但当主持人念出「新人进步奖」时，灯光打到你身上。"},
            {type:"dialog", who:"Cruce（散场路上）", text:"恭喜啊。但你记着——这种奖最大的用，不是让你高兴，是让你别忘了今年凌晨 3 点是怎么过来的。"}
          ],
          choices:[
            {label:"上台简短致谢", tag:"EQ", sub:"得体",
              effects:{comm:2, david:3, legend:1, log:"年会拿新人进步奖"}},
            {label:"上台 + 当众感谢老 K", tag:"cruce", sub:"老 K 关系 ++",
              effects:{comm:2, laok:10, david:1, log:"年会上当众感谢老 K"}}
          ]
        }
      ],
      review: {quote:"滨海路上的两杯咖啡——一杯是你给客户的承诺，一杯是给那个人的。", grade:"L13"}
    },

    /* ============ 2020 ============ */
    {
      year:2020, title:"空荡的园区与亮着的窗", subtitle:"黑天鹅 · 远程相守 · 第一次裁员日",
      siteHeadcount:92,
      events:[
        {
          id:"y20-1", beat:null, title:"1月底 · 疫情爆发 · 紧急 WFH",
          scene:"home", emoji:"🏠",
          body:[
            {type:"narr", text:"凌晨大群一封全员邮件：「即日起全员居家办公，软件园 15 号楼仅保留运维。」第二天你在出租屋阳台上架了 J169，对面楼栋的灯一户一户亮起来。"},
            {type:"p", text:"客户 case 量在两周里翻了 1.5 倍——所有人忽然都要远程办公，UC 和会议产品的 SBI 像潮水一样涌进 queue。"}
          ],
          choices:[
            {label:"主动认领「远程协助」轮值——做团队眼睛", tag:"legend", sub:"传奇分 + 体力 -",
              effects:{stam:-10, legend:3, david:5, log:"WFH 第一周 · 主动认领远程协助"}},
            {label:"自己稳住 case，不抢活", tag:"EQ", sub:"中性",
              effects:{stam:-3, log:"WFH 第一周 · 自己稳住手上 case"}}
          ]
        },
        {
          id:"y20-2", beat:"节点 5 · 疫情救火封神", title:"Q2 · 航空客户全球级 OUG",
          scene:"warroom", emoji:"✈️",
          body:[
            {type:"narr", text:"Air-02 整个 IVR 走错分支，全球 80 个登机口语音播报错乱。Webex war room 21 个人，三国三时区，你在自己出租屋的卧室里戴着耳机连续救了 19 个小时。"},
            {type:"p", text:"老 K 在群里只发了一句：「这场如果你扛下来，别人会用十年记住你。」"},
            {type:"mail", from:"Karen Wells (二线 Manager)", sub:"You are the reason this didn't blow up",
              body:"David told me you led the war room for 19h straight. I'll make sure this is on your file. Get sleep."}
          ],
          choices:[
            {label:"我来当 war room owner，到底", tag:"legend", sub:"英雄 · 传奇分 ++++",
              effects:{tech:6, stam:-35, hp:-5, res:5, legend:12, david:8, log:"疫情救火封神 · 英雄"}},
            {label:"做沉默贡献者，让别人挂头衔", tag:"EQ", sub:"传奇分 +，Manager 印象 +",
              effects:{tech:3, stam:-20, eq:3, legend:6, david:4, log:"疫情救火封神 · 沉默贡献者"}},
            {label:"中途扛不住，把 owner 转给 Eric", tag:"danger", sub:"险些塌方",
              effects:{tech:1, stam:-15, res:-3, legend:2, eric:5, david:-3, log:"疫情救火封神 · 险些塌方"}}
          ]
        },
        {
          id:"y20-3", beat:null, title:"Q3 · 第一次「裁员日」· 便利店深夜",
          scene:"convenience", emoji:"🚬",
          body:[
            {type:"narr", text:"D-Day 当天午饭后，三个老 Contractor 抱着纸箱走出 15 号楼。走廊里没有人说话。晚上 9 点，Cruce 给你发了一条：「楼下便利店，10 分钟到。」"},
            {type:"dialog", who:"Cruce（点着烟，给你递了一根你没接）", text:"以后这种日子，每年都会有一次。看清楚——今天走的人，没一个不优秀。这地方留下来的标准，从来不是『够不够好』。"},
            {type:"p", text:"街对面 15 号楼的灯，比上周少了三盏。"}
          ],
          choices:[
            {label:"沉默听完，记在心里", tag:"cruce", sub:"Cruce 线大幅 +",
              effects:{cruce:15, eq:3, log:"便利店深夜 · 听 Cruce 说裁员的规律"}},
            {label:"和 Cruce 聊到凌晨 1 点", tag:"cruce", sub:"Cruce 线 ++、第二天宿醉",
              effects:{cruce:20, stam:-10, log:"便利店深夜聊到凌晨"}},
            {label:"开玩笑「咱俩这种肯定不会被裁吧」", tag:"danger", sub:"Cruce 不接话",
              effects:{cruce:-3, log:"便利店开玩笑 · Cruce 没接话"}}
          ]
        },
        {
          id:"y20-4", beat:"节点 6 · 关系确定", title:"Q4 · 那一句「在一起吧」",
          scene:"sea", emoji:"🌃",
          body:[
            {type:"narr", text:"星海广场北侧的木栈道，11 月的风很大，TA 围着围巾。你已经犹豫了两周了。"}
          ],
          choices:[
            {label:"自己开口说「我们在一起吧」", tag:"legend", sub:"主动 · 关系起手 ++",
              effects:{spouse:25, eq:2, family:5, log:"星海广场 · 自己开口告白"}},
            {label:"等 TA 开口", tag:"EQ", sub:"关系 +、内向加成",
              effects:{spouse:15, family:3, log:"星海广场 · 等 TA 先开口"}},
            {label:"那天没说，错过了窗口", tag:"danger", sub:"延后到 2021，姿态分扣",
              effects:{spouse:-5, family:-3, flag:{set:"love_late"}, log:"星海广场 · 错过了告白窗口"}}
          ]
        }
      ],
      review: {quote:"空荡的园区与亮着的窗——那一年所有人都在屋里，你却把这座城认成了家。", grade:"L13"}
    },

    /* ============ 2021 ============ */
    {
      year:2021, title:"把行李搬到一起", subtitle:"云上转身 · 同居 · L15-1",
      siteHeadcount:80,
      events:[
        {
          id:"y21-1", beat:null, title:"Q1 · AXP 全公司推 · 选副专精",
          scene:"office", emoji:"☁️",
          body:[
            {type:"narr", text:"全员邮件：「AXP 是未来。请所有 L13+ 在 30 天内选一个云方向副专精。」老 K 撇嘴：「云不云的，最后还是有人凌晨 3 点接电话。」"}
          ],
          choices:[
            {label:"All-in 选 AXP Cloud 作为副专精", tag:"legend", sub:"对齐战略 · David 印象 ++",
              effects:{tech:3, en:1, david:8, log:"副专精选 AXP Cloud"}},
            {label:"选 SBC——把老活做深", tag:"EQ", sub:"老 K 印象 ++、David 微微皱眉",
              effects:{tech:5, laok:8, david:-1, log:"副专精选 SBC 深耕"}},
            {label:"选 Contact Center", tag:"EQ", sub:"中性",
              effects:{tech:3, comm:2, log:"副专精选 CC"}}
          ]
        },
        {
          id:"y21-2", beat:null, title:"Q2 · 同居",
          scene:"home", emoji:"📦",
          body:[
            {type:"narr", text:"把两个人的行李塞进同一辆 SUV，从软件园这头搬到那头。新家 70 平，看得见高新园的海。"}
          ],
          choices:[
            {label:"合租升级——两人租大一点", tag:"EQ", sub:"压力小，但不算「家」",
              effects:{spouse:8, money:-3, log:"同居 · 合租升级"}},
            {label:"父母资助首付，买小房", tag:"legend", sub:"家的雏形 · 但月供压肩",
              effects:{spouse:12, money:-25, family:5, flag:{set:"bought_house"}, log:"同居 · 首付买房"}},
            {label:"共同租大房，存钱观望", tag:"EQ", sub:"中性",
              effects:{spouse:10, money:-5, log:"同居 · 共同租大房"}}
          ]
        },
        {
          id:"y21-3", beat:null, title:"Q3 · 见双方父母",
          scene:"home", emoji:"👨‍👩‍👧",
          body:[
            {type:"narr", text:"年中放假，先见 TA 父母，再回你老家。父母一边夸 TA，一边问出那句你早就准备好答案的话——「打算什么时候办？」"}
          ],
          choices:[
            {label:"给个明确时间表「明年年底」", tag:"legend", sub:"父母安心，伴侣感到稳",
              effects:{family:8, spouse:10, flag:{set:"wedding_committed"}, log:"见父母 · 答应明年年底婚礼"}},
            {label:"模糊带过，先稳事业", tag:"EQ", sub:"父母略失望，伴侣开始等",
              effects:{family:-3, spouse:-5, log:"见父母 · 没给时间表"}}
          ]
        },
        {
          id:"y21-4", beat:"节点 7 上 · 晋升 L15-1", title:"Q4 · David 1:1 · 第二次「裁员日」",
          scene:"conference", emoji:"📈",
          body:[
            {type:"narr", text:"年末的小会议室，David 这次直接打开了笔记本朝向你。屏幕上是一张名单的草稿，第三行是你的名字。"},
            {type:"dialog", who:"David", text:"今年我把你写进 L15-1 了。你不是名单里最亮的，但你是我最不担心睡得着觉的那个。"},
            {type:"p", text:"同一周，第二次「裁员日」事件链走完——12 个人离场，Cruce 险些被列入，最终留下。同事群凌晨发了一张工位俯视图：满格的灯，比去年少了一排。"}
          ],
          choices:[
            {label:"郑重道谢，承诺扛 L15-1 该扛的活", tag:"EQ", sub:"David 信任 +、传奇分 +",
              effects:{david:10, legend:5, log:"晋升 L15-1"}},
            {label:"问 David「Cruce 这次怎么差点上名单？」", tag:"cruce", sub:"David 微妙，Cruce 感动",
              effects:{david:-2, cruce:10, log:"晋升 L15-1 · 还替 Cruce 问了一句"}}
          ]
        }
      ],
      review:{quote:"把行李搬到一起——这一年你拿到了 L15-1，也拿到了一把别人家的钥匙。", grade:"L15-1"}
    },

    /* ============ 2022 ============ */
    {
      year:2022, title:"戒指、婚纱、最佳救火奖 · 老 K 离场", subtitle:"事业冲顶 · 求婚结婚",
      siteHeadcount:65,
      events:[
        {
          id:"y22-1", beat:null, title:"Q2 · L15-2 候选池前置培养",
          scene:"office", emoji:"🎯",
          body:[
            {type:"narr", text:"David 在 1:1 里提到一句：「明年看你能不能进 L15-2 池子。今年别犯大错，再多扛两个跨团队的活。」"}
          ],
          choices:[
            {label:"主动认领一个跨 EMEA 的 SBI", tag:"legend", sub:"体力 - 传奇分 +",
              effects:{tech:3, stam:-10, eric:5, legend:4, log:"主动接跨 EMEA SBI"}},
            {label:"稳住现有 case，不冒进", tag:"EQ", sub:"中性",
              effects:{tech:1, log:"L15-2 池 · 稳住现有 case"}}
          ]
        },
        {
          id:"y22-2", beat:"节点 8 · 求婚（准备）", title:"Q2-Q3 · 戒指与求婚场景",
          scene:"sea", emoji:"💍",
          body:[
            {type:"narr", text:"戒指攒了 3 个月工资。地点你自己选。"},
            {type:"im", who:"Cruce", text:"求婚那天我帮你盯一下值班排班，OUG 真来了我顶一小时。"}
          ],
          choices:[
            {label:"星海广场跨年烟火", tag:"legend", sub:"浪漫值顶 · 撞 OUG 风险高",
              effects:{spouse:25, money:-8, legend:5, flag:{set:"propose_starsea"}, log:"求婚 · 星海广场跨年"}},
            {label:"滨海路日落", tag:"EQ", sub:"稳",
              effects:{spouse:20, money:-6, log:"求婚 · 滨海路日落"}},
            {label:"家里 · 一束花一盏灯", tag:"EQ", sub:"温暖 · 双方家长加分",
              effects:{spouse:18, money:-3, family:8, log:"求婚 · 家里"}}
          ]
        },
        {
          id:"y22-3", beat:"节点 8 · 婚礼 · 老 K 被裁", title:"Q3 · 第三次「裁员日」+ 婚礼",
          scene:"wedding", emoji:"💒",
          body:[
            {type:"narr", text:"婚礼日期就在第三次「裁员日」之后两周。名单里有老 K——12 年司龄，被砍掉的部门连他自己也意外。"},
            {type:"dialog", who:"老 K（告别酒局上）", text:"我没事，我大儿子明年高考。你婚礼那天我要是没去，别多想。"},
            {type:"im", who:"Cruce（婚礼当晚）", text:"这地方早晚都得轮到我。但今天先恭喜你——好好抱住你怀里那个。"}
          ],
          choices:[
            {label:"帮老 K 内推到客户那边 + 大连办婚礼", tag:"cruce", sub:"老 K 线圆满 + 隐藏结局条件 +",
              effects:{laok:25, money:-15, spouse:15, family:5, flag:{set:"laok_referred", set2:"wed_dalian"}, log:"帮老 K 内推 · 大连办婚礼"}},
            {label:"私下打 5 万救急 + 老家办婚礼", tag:"EQ", sub:"老 K 感动 · 父母满意",
              effects:{laok:15, money:-25, spouse:10, family:10, flag:{set:"wed_home"}, log:"私下打钱救老 K · 老家办婚礼"}},
            {label:"旁观 · 双城办婚礼", tag:"danger", sub:"老 K 关系冷 · 双方父母都满意",
              effects:{laok:-10, money:-20, spouse:8, family:6, flag:{set:"wed_dual"}, log:"老 K 那边没出手 · 双城办婚礼"}},
            {label:"老 K 那边没出手 · 旅行结婚简办", tag:"danger", sub:"省钱省事 · 父母失望",
              effects:{laok:-10, money:-5, spouse:5, family:-8, flag:{set:"wed_travel"}, log:"简办旅行结婚 · 老 K 那边没出手"}}
          ]
        },
        {
          id:"y22-4", beat:null, title:"Q4 · 年会 · 最佳救火奖",
          scene:"party", emoji:"🏆",
          body:[
            {type:"narr", text:"年会终场，主持人念到「最佳救火奖」。台下的人都看你。Karen 的视频连线在大屏幕上举着酒杯。"},
            {type:"dialog", who:"David", text:"上台。今年这奖谁都没有异议。"}
          ],
          choices:[
            {label:"致辞里提到 Eric 和老 K", tag:"legend", sub:"传奇分 + 跨团队 +",
              effects:{legend:8, eric:8, laok:5, comm:3, log:"最佳救火奖 · 致辞提到队友"}},
            {label:"致辞里只感谢 David 和 Karen", tag:"EQ", sub:"Manager 印象 +、Cruce 微微摇头",
              effects:{legend:5, david:8, cruce:-3, log:"最佳救火奖 · 只感谢 Manager"}}
          ]
        }
      ],
      review:{quote:"戒指、婚纱、最佳救火奖——这一年的高光，是你后来反复回想的那一帧。", grade:"L15-1"}
    },

    /* ============ 2023 ============ */
    {
      year:2023, title:"L15-2、重组通知与备孕日历", subtitle:"巅峰之上的第一阵风",
      siteHeadcount:55,
      events:[
        {
          id:"y23-1", beat:null, title:"Q1 · 蜜月 + 第一次大吵架",
          scene:"home", emoji:"💥",
          body:[
            {type:"narr", text:"蜜月回来不到一周，第一次大吵——起因是你蜜月最后一天还回了 3 封工作邮件。TA 摔了门，你坐在阳台抽了半根烟。"}
          ],
          choices:[
            {label:"主动道歉 + 立刻删邮件 APP 通知", tag:"EQ", sub:"关系 +、技术响应 -",
              effects:{spouse:15, eq:3, comm:-1, log:"蜜月吵架 · 主动道歉 · 关静音"}},
            {label:"解释「客户真的等着」", tag:"danger", sub:"关系冷、Manager 印象 +",
              effects:{spouse:-15, david:3, log:"蜜月吵架 · 解释客户等不了"}}
          ]
        },
        {
          id:"y23-2", beat:"节点 9 · 公司重组 · 站队", title:"Q2 · Frank 空降",
          scene:"conference", emoji:"♟",
          body:[
            {type:"narr", text:"全员邮件：与某 RTC 巨头深度绑定，组织重组。David 升二线，新 TL「Frank」从美国空降，第一次大连见面会上就讲了 40 分钟战略。"},
            {type:"dialog", who:"Frank（散会后单独留你）", text:"David 跟我推荐过你。你的位置我希望你站清楚——这不是站队，是站方向。"}
          ],
          choices:[
            {label:"旧帅派 · 站 David", tag:"EQ", sub:"忠诚 + David 信任、Frank 印象 -",
              effects:{david:12, frank:-8, flag:{set:"side_david"}, log:"站队 · 旧帅派"}},
            {label:"新帅派 · 站 Frank", tag:"danger", sub:"Frank +、David 失望、Cruce 微妙",
              effects:{david:-10, frank:15, cruce:-3, flag:{set:"side_frank"}, log:"站队 · 新帅派"}},
            {label:"中立——「我跟着活儿走」", tag:"cruce", sub:"两边都不亲、Cruce 认可",
              effects:{david:-2, frank:0, cruce:8, flag:{set:"side_neutral"}, log:"站队 · 中立"}}
          ]
        },
        {
          id:"y23-3", beat:"节点 7 下 · 晋升 L15-2", title:"Q3 · 「那位大连的 Backbone」",
          scene:"office", emoji:"🦴",
          body:[
            {type:"narr", text:"晋升公告下来：L15-2 · Backbone Engineer · APAC Tier-3。客户邮件抬头开始出现「那位大连的 Backbone」。"},
            {type:"p", text:"——这是你职业生涯的最高点。"}
          ],
          choices:[
            {label:"开始有意识培养小赵接班", tag:"legend", sub:"师徒线 + 隐藏结局条件 +",
              effects:{eq:3, legend:6, flag:{set:"mentor_xiaozhao"}, log:"L15-2 · 开始带小赵"}},
            {label:"埋头自己扛——别人接不住", tag:"EQ", sub:"传奇分 + 体力 -",
              effects:{tech:3, stam:-10, legend:4, log:"L15-2 · 埋头自己扛"}}
          ]
        },
        {
          id:"y23-4", beat:null, title:"Q3-Q4 · 第四次「裁员日」+ Cruce 提新加坡",
          scene:"convenience", emoji:"💨",
          body:[
            {type:"narr", text:"重组配套 RIF，砍了 David 派若干人。Cruce 因被 Frank 划为「中立技术派」而幸存。还是那家便利店，他给你看手机。"},
            {type:"dialog", who:"Cruce", text:"新加坡那边的内部岗在招 Infinity 售前。我已经在看了。你别声张。"},
            {type:"p", text:"屏幕角落第一次出现一行小字：「AI Copilot 内测立项 — Q1 推送」。"}
          ],
          choices:[
            {label:"鼓励他「该走就走」", tag:"cruce", sub:"Cruce 关系 ++",
              effects:{cruce:15, log:"鼓励 Cruce 看新加坡岗"}},
            {label:"试图劝他留下", tag:"EQ", sub:"Cruce 微微一笑没接",
              effects:{cruce:-3, log:"劝 Cruce 留下"}}
          ]
        }
      ],
      review:{quote:"L15-2、重组通知与备孕日历——你站在最高的那个山头，第一次听见远处的风。", grade:"L15-2"}
    },

    /* ============ 2024 ============ */
    {
      year:2024, title:"Copilot 上线那天，B 超也亮了，Infinity 也来了", subtitle:"被时代质问 · 准爸爸",
      siteHeadcount:42,
      events:[
        {
          id:"y24-1", beat:null, title:"Q1 · Avaya Infinity 战略 · 速成营",
          scene:"conference", emoji:"♾️",
          body:[
            {type:"narr", text:"CEO 全员邮件：「Avaya Infinity is the future. We are all in.」三周强训占满 Slot 2/3，老 K 已经走了，但他临走前那句话还在群里被人转：「这玩意儿真上线，第一年要救火救出血来。」"},
            {type:"mail", from:"Frank (TL)", sub:"Mandatory: Infinity Bootcamp · 3 weeks",
              body:"All engineers L13+ must pass the Infinity Bootcamp by end of Q1. Posture matters - I'll be reviewing."}
          ],
          choices:[
            {label:"积极派——抢先认领第一个 Infinity case", tag:"legend", sub:"Frank +、绑沉船风险",
              effects:{tech:2, en:2, frank:12, flag:{set:"infi_active"}, log:"Infinity 速成营 · 积极派"}},
            {label:"务实派——按要求过，私下留心眼", tag:"EQ", sub:"中性 · 长期稳",
              effects:{tech:2, flag:{set:"infi_pragmatic"}, log:"Infinity 速成营 · 务实派"}},
            {label:"抵触派——会上提风险", tag:"cruce", sub:"Frank -、老兵和 Cruce 认可",
              effects:{tech:1, frank:-10, cruce:8, flag:{set:"infi_skeptic"}, log:"Infinity 速成营 · 抵触派"}}
          ]
        },
        {
          id:"y24-2", beat:"节点 10 · 怀孕确认", title:"Q2 · 两条线",
          scene:"home", emoji:"👶",
          body:[
            {type:"narr", text:"晚上 22:47，TA 把验孕棒放在洗手台沿上。两条线。当晚你手上压着一个 SBI，客户在催。"}
          ],
          choices:[
            {label:"立刻关掉电脑，陪 TA 看到天亮", tag:"legend", sub:"父亲身份分起手 ++ · 父亲分激活",
              effects:{spouse:25, family:10, father:15, log:"怀孕确认夜 · 关电脑陪到天亮"}},
            {label:"先把 SBI 推一版给印度，1 小时后回", tag:"EQ", sub:"中性",
              effects:{spouse:8, father:8, log:"怀孕确认夜 · 推完 SBI 才回"}},
            {label:"先把 SBI 关掉，再回家", tag:"danger", sub:"父亲分起手低",
              effects:{spouse:-5, david:3, father:3, log:"怀孕确认夜 · 先关 SBI"}}
          ]
        },
        {
          id:"y24-3", beat:null, title:"Q3 · 第一个 Infinity case · AI RCA 误导",
          scene:"warroom", emoji:"🤖",
          body:[
            {type:"narr", text:"Infinity 6 周大版本上线一周，客户报 P1。AI Copilot 给出 RCA 草稿——看起来非常专业。"},
            {type:"mail", from:"AI Copilot RCA", sub:"Suggested Root Cause",
              body:"Root cause: customer-side firewall blocking signaling port 5061 intermittently. Recommended action: customer to whitelist Avara Infinity edge subnets."}
          ],
          choices:[
            {label:"采信，直接发给客户", tag:"danger", sub:"客户改配置 → 生产更糟 · CSAT 暴雷",
              effects:{tech:-3, comm:-5, legend:-5, david:-5, log:"采信 AI RCA · CSAT 暴雷"}},
            {label:"质疑，自己重新抓 trace", tag:"legend", sub:"6 小时 +、找到真凶、传奇分 ++",
              effects:{tech:6, stam:-15, legend:8, frank:3, log:"质疑 AI RCA · 找到真凶"}},
            {label:"先内部 ping 印度 R&D 复核", tag:"EQ", sub:"24 小时 +、客户等",
              effects:{tech:2, en:2, log:"AI RCA · 让印度复核"}}
          ]
        },
        {
          id:"y24-4", beat:"L15-3 名单落空 #1", title:"Q4 · Frank 的 1:1",
          scene:"conference", emoji:"📉",
          body:[
            {type:"narr", text:"年末 1:1，Frank 把咖啡杯往边上推了推。"},
            {type:"dialog", who:"Frank", text:"今年没把你写进 L15-3 名单。Global headcount freeze under restructuring。明年再来。"},
            {type:"im", who:"David（已升二线 · 私下）", text:"我尽力了。明年还可以争。"}
          ],
          choices:[
            {label:"追问具体原因", tag:"legend", sub:"Frank 微皱眉",
              effects:{frank:-3, legend:2, log:"L15-3 落空 #1 · 追问原因"}},
            {label:"沉默接受", tag:"EQ", sub:"中性",
              effects:{eq:1, log:"L15-3 落空 #1 · 沉默接受"}},
            {label:"暗示「也在看外面」", tag:"danger", sub:"Frank 警惕",
              effects:{frank:-8, log:"L15-3 落空 #1 · 暗示在看外面"}}
          ]
        }
      ],
      review:{quote:"Copilot 上线那天，B 超也亮了——你头一回真切感到：时代和身体里的新生命同时在敲门。", grade:"L15-2"}
    },

    /* ============ 2025 ============ */
    {
      year:2025, title:"Infinity 救火、学区房、胎动与裁员风声", subtitle:"暗流涌动 · 自救",
      siteHeadcount:30,
      events:[
        {
          id:"y25-1", beat:null, title:"Q2 · 胎动那一秒",
          scene:"home", emoji:"💗",
          body:[
            {type:"narr", text:"周六下午，TA 抓住你的手按在肚子上。第一下胎动，像是水面下面有人轻轻敲了一下杯子。"}
          ],
          choices:[
            {label:"当场决定推掉所有夜间团建一年", tag:"legend", sub:"父亲分 ++ · 老兵口碑 -",
              effects:{family:10, father:15, david:-3, flag:{set:"father_awakened"}, log:"胎动 · 父亲觉醒 · 推掉夜间团建"}},
            {label:"录视频发给爸妈", tag:"EQ", sub:"中性 +",
              effects:{family:8, father:8, log:"胎动 · 录视频发爸妈"}}
          ]
        },
        {
          id:"y25-2", beat:null, title:"Q3 · 大连教育新政 · 学区房",
          scene:"city", emoji:"🏘",
          body:[
            {type:"narr", text:"中介电话一天打 6 次。新政策落地，原来你看中的那个学区，要么本月签，要么明年溢价 20%。"}
          ],
          choices:[
            {label:"卖现住房 + 凑首付，上车学区", tag:"danger", sub:"现金流极紧、终章压力 ++",
              effects:{money:-40, family:10, flag:{set:"bought_school"}, log:"学区房 · 上车 · 月供高位"}},
            {label:"找父母借 30 万", tag:"EQ", sub:"父母压力、关系微妙",
              effects:{money:-20, family:-5, flag:{set:"borrowed_parents"}, log:"学区房 · 啃老首付"}},
            {label:"放弃学区，先稳现金流", tag:"legend", sub:"终章被裁后稳",
              effects:{money:5, family:-8, flag:{set:"skip_school"}, log:"放弃学区房 · 保现金流"}}
          ]
        },
        {
          id:"y25-3", beat:"节点 11a · Cruce 调岗", title:"Q4 · 周水子机场 · 「你也别等了」",
          scene:"airport", emoji:"✈️",
          body:[
            {type:"narr", text:"4 周事件链走完——W-4 内部公告、W-3 私下饭局、W-2 工作交接、W-1 全员告别酒局。今天 D-Day，周水子机场早上 6 点。窗外是冬天的大连。"},
            {type:"dialog", who:"Cruce（拎着两个行李箱）", text:"我先走一步，不是因为我比你聪明，是因为我没有你那么多东西要护住。"},
            {type:"quote", text:"你也别等了。等公司给你结果，不如自己给公司一个结果。但你现在身上有娃、有房、有 L15-2 的舒服，所以你不会走。我懂。那就在原地，把你的脊梁练得再硬一点。"}
          ],
          choices:[
            {label:"我送你 · 把建议听进去了", tag:"cruce", sub:"Cruce 线锁定高位 · 内心独白记录",
              effects:{cruce:15, eq:5, legend:5, flag:{set:"cruce_send", set2:"cruce_warning_heard"}, log:"机场送 Cruce · 把建议听进去了"}},
            {label:"我送你 · 没听懂他在说什么", tag:"EQ", sub:"Cruce 线 + · 终章伏笔少一层",
              effects:{cruce:10, flag:{set:"cruce_send"}, log:"机场送 Cruce · 没听懂"}},
            {label:"没去机场，发了一条「保重」", tag:"danger", sub:"Cruce 线锁低、内心更难受",
              effects:{cruce:-5, log:"没去机场送 Cruce"}}
          ]
        },
        {
          id:"y25-4", beat:"L15-3 名单落空 #2", title:"Q4 · 年末 1:1 · 第二次落空",
          scene:"conference", emoji:"❄",
          body:[
            {type:"narr", text:"Cruce 的工位已经清空。同一间会议室。Frank 这次没说「明年再来」。"},
            {type:"dialog", who:"Frank", text:"AI Copilot ROI 评估期内暂停 L15-3 名额。今年仍然没法把你写进去。"},
            {type:"narr", text:"散场时窗外正好下雪。你第一次意识到：也许你永远停在 L15-2 了——不是你不够，是 Frank 不会写。"}
          ],
          choices:[
            {label:"平静接受", tag:"EQ", sub:"内伤 · 但姿态稳",
              effects:{eq:2, res:2, log:"L15-3 落空 #2 · 平静接受"}},
            {label:"问 Frank「你是真保不住，还是不想保？」", tag:"legend", sub:"Frank 沉默 · 隐藏分 +",
              effects:{frank:-8, legend:6, flag:{set:"asked_frank"}, log:"L15-3 落空 #2 · 当面问 Frank"}}
          ]
        }
      ],
      review:{quote:"Infinity 救火、学区房、胎动与裁员风声——能借肩膀的人都走了，你的脊梁第一次被独自压上整面墙。", grade:"L15-2"}
    },

    /* ============ 2026 上半段（终章前奏） ============ */
    {
      year:2026, title:"最长的一年", subtitle:"被裁 ∥ 新生",
      siteHeadcount:20,
      events:[
        {
          id:"y26-1", beat:"节点 11 · 全球 RIF 启动", title:"Q1 · Cost Optimization",
          scene:"office", emoji:"🌫",
          body:[
            {type:"narr", text:"Q1 财报后，全球邮件下来：「Company-wide cost optimization following the Infinity transformation period.」大连办公室名单未定。"},
            {type:"im", who:"小赵", text:"师傅，我昨晚梦见你被叫去 HR。"}
          ],
          choices:[
            {label:"安抚小赵，自己开始整理简历", tag:"legend", sub:"私下准备",
              effects:{eq:3, flag:{set:"resume_ready"}, log:"开始整理简历 · 安抚小赵"}},
            {label:"装作什么都不知道，照常做", tag:"EQ", sub:"内心煎熬",
              effects:{res:-3, log:"装作什么都不知道"}}
          ]
        },
        {
          id:"y26-2", beat:null, title:"Q2 · 班加罗尔扩招泄露",
          scene:"desk", emoji:"📨",
          body:[
            {type:"narr", text:"群里有人转出一张内部 PPT 截图——班加罗尔团队明年要扩 40 人，岗位描述和你手上的活高度重叠。"},
            {type:"p", text:"群里没人说话，过了 10 分钟才有人发了一个「。」。"}
          ],
          choices:[
            {label:"截图存档 + 转给猎头", tag:"legend", sub:"实际行动 +",
              effects:{flag:{set:"reached_headhunter"}, log:"截图发猎头"}},
            {label:"不看不转，继续干活", tag:"EQ", sub:"内伤",
              effects:{res:-3, log:"班加罗尔扩招 · 装看不见"}}
          ]
        },
        {
          id:"y26-3", beat:null, title:"Q3 · 谢幕演出",
          scene:"warroom", emoji:"🎬",
          body:[
            {type:"narr", text:"一个跟了你 6 年的 Aura 老客户，主动指名要你处理一个高难度 case——不是 Infinity，是回到你最熟悉的老战场。"},
            {type:"mail", from:"Bank-23 IT VP", sub:"Please assign this to your Dalian Backbone",
              body:"We want the person who handled our 2020 outage. We trust him/her - and frankly, we trust very few people at Avara anymore."}
          ],
          choices:[
            {label:"满分闭环 · 一人扛到底", tag:"legend", sub:"职业生涯谢幕演出 · 传奇分 ++++",
              effects:{tech:5, stam:-20, legend:15, flag:{set:"farewell_perfect"}, log:"谢幕演出 · 满分闭环"}},
            {label:"拉小赵一起做，让他主写 RCA", tag:"cruce", sub:"师徒线圆满 · 隐藏结局条件 +",
              effects:{tech:3, legend:10, flag:{set:"xiaozhao_succeed"}, log:"谢幕演出 · 带小赵满分闭环"}}
          ]
        },
        {
          id:"y26-4", beat:"节点 11 · 名单出现", title:"Q3 末 · HR 会议邀请",
          scene:"desk", emoji:"📧",
          body:[
            {type:"narr", text:"周二下午邮件角落多了一封会议邀请："},
            {type:"mail", from:"HR Cathy Wen", sub:"15:00 - 15:30 · 1-on-1 · Career Discussion · with David & Cathy",
              body:"Please join us in Room 15-403 next week. Topic: Career Discussion."},
            {type:"p", text:"老玩家一眼就懂这意味着什么。"}
          ],
          choices:[
            {label:"接受邀请 · 当晚和 TA 说了一半", tag:"legend", sub:"伴侣早一步知道",
              effects:{spouse:5, flag:{set:"told_spouse_early"}, log:"HR 邀请 · 告诉了 TA 一半"}},
            {label:"接受邀请 · 一个字没和家里说", tag:"EQ", sub:"独自扛",
              effects:{res:3, log:"HR 邀请 · 没和家里说"}}
          ]
        }
      ],
      review:{quote:"潮水退到了脚踝——你以为自己还在岸上，其实下一个浪已经在身后。", grade:"L15-2"}
    }
  ],

  /* =================================================================
   * 终章 · 最长的一天（多段连续演出，每段是 1 个事件）
   * ================================================================= */
  finale: {
    title:"终章 · 最长的一天",
    siteHeadcount:20,
    beats:[
      {
        id:"fin-1", tick:"10:47 AM", title:"羊水破了",
        scene:"home", emoji:"📞",
        body:[
          {type:"narr", text:"周二上午 10:47，办公桌上手机震动两下。"},
          {type:"dialog", who:"TA（电话那头声音发抖）", text:"羊水破了，我已经在去医院的路上。爸妈赶过去要 1 小时——你来得了吗？"}
        ],
        choices:[
          {label:"立刻打车去医院", tag:"legend", sub:"姿态分 + 父亲分 ++",
            effects:{father:15, spouse:10, flag:{set:"go_hospital_first"}, log:"10:47 · 立刻打车去医院"}},
          {label:"先把手上 SBI 推一版交给小赵", tag:"EQ", sub:"中性",
            effects:{father:5, flag:{set:"handoff_first"}, log:"10:47 · 先交接 SBI"}},
          {label:"先回那封 HR 会议确认邮件", tag:"danger", sub:"父亲分 -",
            effects:{father:-3, frank:2, flag:{set:"hr_first"}, log:"10:47 · 先回 HR 邮件"}}
        ]
      },
      {
        id:"fin-2", tick:"11:12 AM", title:"邮件弹窗",
        scene:"desk", emoji:"📨",
        body:[
          {type:"mail", from:"Cathy Wen (HR)", sub:"15:00 - 15:30 · 1-on-1 · Career Discussion · with David & Cathy",
            body:"Just confirming. Please join via the link in your calendar. Materials will be shared on screen."},
          {type:"narr", text:"你盯着屏幕——日历上 15:00 那个会议邀请已经标了红色感叹号。Webex link 一闪一闪。"}
        ],
        choices:[
          {label:"会议室准时进 · 哪怕你已经在医院走廊", tag:"legend", sub:"体面分 +、姿态稳",
            effects:{legend:3, res:3, flag:{set:"attend_hr"}, log:"11:12 · 决定 15:00 准时进会议"}},
          {label:"提前发邮件请假——我去陪产", tag:"cruce", sub:"父亲分 ++ 但 HR 流程延后",
            effects:{father:10, frank:-5, flag:{set:"skip_hr"}, log:"11:12 · 发邮件请假陪产"}}
        ]
      },
      {
        id:"fin-3", tick:"12:00 PM", title:"客户在催 SBI",
        scene:"warroom", emoji:"🚨",
        body:[
          {type:"im", who:"客户 IT Manager", text:"Hey - any update on the SBI from this morning? Our floor manager is asking. We saw your team is changing - is your case still being handled?"},
          {type:"p", text:"你手指悬在键盘上，TA 在医院刚发来一张 B 超的近照，小赵在另一头窗口里问「师傅这条要不要回」。"}
        ],
        choices:[
          {label:"亲自回，3 句话稳住客户", tag:"legend", sub:"传奇分 +、5 分钟",
            effects:{tech:1, legend:3, log:"12:00 · 亲自回客户 SBI"}},
          {label:"丢给小赵 · 「按谢幕演出那一招做」", tag:"cruce", sub:"师徒线 ++、隐藏结局条件 +",
            effects:{legend:2, flag:{set:"xiaozhao_takeover"}, log:"12:00 · 丢给小赵 · 师徒线圆满"}},
          {label:"暂时不回 · 全力赶去医院", tag:"danger", sub:"客户关系 -",
            effects:{father:5, comm:-2, log:"12:00 · 不回 SBI · 直奔医院"}}
        ]
      },
      {
        id:"fin-4", tick:"15:00 PM", title:"Notification of Position Elimination",
        scene:"conference", emoji:"📄",
        body:[
          {type:"narr", text:"15:00 · 不管你人在哪：Webex 接通。Cathy 的脸出现在屏幕上方，David 在右下角，目光垂着。"},
          {type:"dialog", who:"Cathy Wen", text:"……this letter confirms the elimination of your position as Backbone Engineer · L15-2 at Avara Dalian Site……"},
          {type:"p", text:"她语气平静地念到 N+X 那一段——你听见自己的心跳忽然慢下来。"}
        ],
        choices:[
          {label:"等她念完，然后说「Thank you, Cathy」", tag:"legend", sub:"体面分顶 · 隐藏结局条件 +",
            effects:{legend:5, eq:3, flag:{set:"hr_dignified"}, log:"15:00 · 体面收下 Notification"}},
          {label:"打断她「N+X 的 X 能不能再谈」", tag:"EQ", sub:"X 值 + 1、Cathy 沉默 3 秒",
            effects:{money:3, flag:{set:"negotiated_X"}, log:"15:00 · 当场谈 X"}},
          {label:"全程沉默，只在最后点头", tag:"EQ", sub:"中性",
            effects:{res:2, log:"15:00 · 全程沉默"}}
        ]
      },
      {
        id:"fin-5", tick:"15:0?", title:"产房门开了",
        scene:"newborn", emoji:"👶",
        body:[
          {type:"narr", text:"会议结束那一秒，产房的门被推开。护士抱着一个小小的、皱巴巴的、还在哭的人。"},
          {type:"dialog", who:"护士", text:"恭喜，是个……（性别由你此前选择决定）"},
          {type:"quote", text:"屏幕分屏：左半 PDF 标题「Notification of Position Elimination」，右半婴儿啼哭。两个时间戳一致到秒。"}
        ],
        // 这条不给选项，触发分屏演出后进入独白
        next:"fin-mono"
      },
      {
        id:"fin-mono", tick:"内心独白", title:"在这一秒，你想说的那句话",
        scene:"newborn", emoji:"🎙",
        body:[
          {type:"narr", text:"屏幕全白半秒，再渐入婴儿的特写。你的内心独白——只能选一段。"}
        ],
        choices:[
          {label:"A · 「在我失去一个身份的同一秒，我成为了另一个身份。」", tag:"EQ", sub:"成就 · 同一秒",
            effects:{flag:{set:"mono_A", set2:"ach_sameSecond"}, log:"独白 A"}},
          {label:"B · 「Avaya 给了我 8 年，今天她还了我一个人。」", tag:"EQ", sub:"成就 · 另一种 Backbone（部分）",
            effects:{flag:{set:"mono_B"}, log:"独白 B"}},
          {label:"C · 「原来传奇不是没有摔倒，是摔倒的时候，怀里有东西要护住。」", tag:"legend", sub:"成就 · 另一种 Backbone · 隐藏结局条件",
            effects:{legend:5, flag:{set:"mono_C", set2:"ach_anotherBackbone"}, log:"独白 C"}}
        ]
      }
    ]
  },

  /* =================================================================
   * 尾声章 · 新生 / Reborn —— 3 个连续小选择决定结局
   * ================================================================= */
  epilogue: {
    title:"尾声章 · 新生 / Reborn",
    intro:"医院走廊一镜到底，背景是大连冬夜的风。你在医院楼下站了很久——抽完最后一支烟 / 喝完最后一杯咖啡。回家路上 3 个小选择，决定你怎么带着「被裁」+「新生」走进下一段人生。",
    steps:[
      {
        id:"epi-1", q:"递到你面前的 offer，接哪一份？",
        choices:[
          {label:"云厂 offer · 公积金齐 · 月薪比 Avara 高 10%", tag:"legend",
            effects:{flag:{set:"choice_cloud"}}, log:"接云厂 offer"},
          {label:"和小赵一起出来做小工作室", tag:"cruce",
            effects:{flag:{set:"choice_startup"}}, log:"和小赵创业"},
          {label:"原公司另一条业务线 · 转岗回 Avara", tag:"EQ",
            effects:{flag:{set:"choice_transfer"}}, log:"转岗回 Avara"},
          {label:"全职爸爸 · 三年后再说", tag:"cruce",
            effects:{flag:{set:"choice_father"}}, log:"全职爸爸"},
          {label:"上海高薪 offer · 双城分居一年", tag:"danger",
            effects:{flag:{set:"choice_relocate"}}, log:"上海高薪 · 双城分居"},
          {label:"暂不决定 · 给自己三个月 gap", tag:"EQ",
            effects:{flag:{set:"choice_gap"}}, log:"三个月 gap"}
        ]
      },
      {
        id:"epi-2", q:"父母那边，你打算怎么说？",
        choices:[
          {label:"实话 · 但用「主动 gap」的话术", tag:"EQ",
            effects:{family:3, flag:{set:"parents_softTruth"}}, log:"父母 · 软实话"},
          {label:"等三个月，找到下家再说", tag:"EQ",
            effects:{flag:{set:"parents_delay"}, family:-2}, log:"父母 · 等三个月"},
          {label:"完全不告诉 · 永远不告诉", tag:"danger",
            effects:{flag:{set:"parents_hide"}, family:-5}, log:"父母 · 不告诉"}
        ]
      },
      {
        id:"epi-3", q:"TA 抱着孩子坐在副驾，回家路上你怎么开口？",
        choices:[
          {label:"实话 · 现在就说", tag:"legend",
            effects:{spouse:15, flag:{set:"spouse_now", set2:"ach_sheKnowsFirst"}}, log:"对 TA · 现在就说"},
          {label:"缓三个月 · 等月子结束再说", tag:"EQ",
            effects:{spouse:-3, flag:{set:"spouse_wait"}}, log:"对 TA · 缓三个月"},
          {label:"让父母转达 · 自己说不出口", tag:"danger",
            effects:{spouse:-10, family:-3, flag:{set:"spouse_proxy"}}, log:"对 TA · 父母转达"}
        ]
      }
    ]
  },

  /* =================================================================
   * 结局（7 + 1 隐藏）—— 计算函数在 game.js 里
   * ================================================================= */
  endings: {
    cloud: {
      name:"「云上重生」",
      narr:"三个月后入职新公司，工牌从旧到新只在镜头里换了一下。海还是那片海，工位换了一栋楼。",
      threeYearsLater:"3 年后，你在新公司带一个 6 人小团队，孩子开始叫你「爸爸」。"
    },
    startup: {
      name:"「自立门户」",
      narr:"你和小赵在软件园对面咖啡馆挂上了一块小小的招牌。第一年只有 3 个客户，但都是真心相信你。",
      threeYearsLater:"3 年后，公司 12 个人。前同事里有 4 个加入。Cruce 从新加坡发来订单。"
    },
    transfer: {
      name:"「转岗归来」",
      narr:"同一栋楼，不同的楼层。新的工牌打印出来时，前台那位阿姨抬头看了你一眼：「欸，是你呀。」",
      threeYearsLater:"3 年后，你在 Avara 的另一条产品线做了 Principal Engineer。同事不再叫你 Backbone，叫你「那位老兵」。"
    },
    father: {
      name:"「全职父亲」",
      narr:"凌晨喂奶时的窗外天光，第一次让你觉得 8 小时睡眠是奢侈品。但你不后悔。",
      threeYearsLater:"3 年后，孩子上幼儿园中班。TA 升了，你接手一些远程顾问活，仍然是家里那个「先到家的人」。"
    },
    balance: {
      name:"「平衡之道」",
      narr:"三个月 gap，在大连各处带娃散步。从星海到东港，从黑石礁到棒棰岛。你拍了 1000 张照片，没发朋友圈。",
      threeYearsLater:"3 年后，你接了一家本地公司的远程顾问活，工资不如从前，但每天和孩子吃晚饭。"
    },
    drift: {
      name:"「漂泊远行」",
      narr:"高铁站告别那天，孩子在 TA 怀里挥手。你一个人坐了 6 小时的车，到上海下车时下着小雨。",
      threeYearsLater:"3 年后，你在上海升到 Director，家在大连。月底回家一次。孩子见你的时候会先愣 3 秒。",
      bad:true
    },
    fade: {
      name:"「黯然落幕」",
      narr:"医院走廊的长椅，远处孩子哭声忽远忽近。你拒绝了所有 offer，也拒绝了所有电话。",
      threeYearsLater:"3 年后……（这一段镜头被刻意留白）",
      bad:true
    },
    unqualified: {
      name:"「不合格工程师」",
      narr:"OCD 里分给你的 SR 一次次被退回，Siebel closure note 上堆满了 reviewer comment。第三个月低分后，David 把你叫进 15-403：这一次不是全球 RIF，而是能力不达标。",
      threeYearsLater:"3 年后，你已经离开通信行业。偶尔路过软件园 15 号楼，会想起那些 6am 早班里没有闭环的 case。",
      bad:true
    },
    legendary: {
      name:"★「Backbone 传奇」",
      narr:"被裁的那一周，你写的最后一篇 KB 在全球被同事自发翻译成 5 种语言。镜头切回产房，你对怀里的孩子说：「你爸爸做的活儿，机器还要再学十年。」",
      threeYearsLater:"3 年后，你的名字在 Avara 内网那篇 KB 文章下方，仍然是被引用最多的那一条。",
      hidden:true
    }
  }
};

/* =================================================================
 * 月度剧情扩展
 * -----------------------------------------------------------------
 * 保留原主线事件，同时为每年补齐月度日常，并固定加入：
 * - 每年 4 月：工会三天两晚 outing（前期省外，后期预算收缩为省内）
 * - 每年 5 月：大连市工会划龙舟比赛（落在 2-6 月活动季）
 * - 每年 10-12 月：工会 5 公里跑步活动
 * ================================================================= */
(function expandMonthlyStory(){
  const anchorMonths = {
    "y18-1":1, "y18-2":4, "y18-3":7, "y18-4":8,
    "y19-1":6, "y19-2":9, "y19-3":10, "y19-4":12,
    "y20-1":1, "y20-2":6, "y20-3":9, "y20-4":12,
    "y21-1":1, "y21-2":6, "y21-3":9, "y21-4":12,
    "y22-1":2, "y22-2":6, "y22-3":9, "y22-4":12,
    "y23-1":1, "y23-2":6, "y23-3":9, "y23-4":11,
    "y24-1":1, "y24-2":6, "y24-3":9, "y24-4":12,
    "y25-1":6, "y25-2":8, "y25-3":10, "y25-4":12,
    "y26-1":1, "y26-2":6, "y26-3":8, "y26-4":9
  };

  const arcs = {
    2018: {stage:"新人期", work:"把老 K 的 checklist 抄进自己的笔记本，开始分清 BI、SBI 和真正会让客户半夜打电话的东西。", home:"出租屋的暖气有时不热，你习惯了在下班路上买一份关东煮。"},
    2019: {stage:"站稳期", work:"你开始独立接 case，也开始明白客户真正要的不是术语，而是一个可执行的下一步。", home:"周末的滨海路和咖啡馆慢慢变得具体，手机里多了一个会等你下班的人。"},
    2020: {stage:"远程救火期", work:"远程办公把客厅变成了工位，全球客户的时区压在同一块屏幕上。", home:"城市安静下来，外卖袋挂在门把手上，你第一次把大连当成需要守住的地方。"},
    2021: {stage:"同居成长期", work:"AXP、SBC、云化路线在会议里反复出现，你的名字也越来越常被 David 点到。", home:"两个人的日用品开始挤满洗手台，争吵和晚饭一样成为生活的一部分。"},
    2022: {stage:"高光与代价", work:"晋升候选池、婚礼筹备和老同事离开挤在同一年，你学会在人群里笑，在工位上沉默。", home:"戒指、婚纱照和房租账单并排放在桌上，每一项都不像演习。"},
    2023: {stage:"重组站队期", work:"Frank 空降后，会议纪要的措辞开始变得锋利，站队不再是八卦。", home:"备孕日历贴在冰箱上，你每次深夜回家都会下意识把门关轻一点。"},
    2024: {stage:"Infinity 转型期", work:"AI RCA、Infinity Bootcamp 和客户质疑一起袭来，旧经验开始被迫重写。", home:"B 超单夹在工牌套后面，你知道家里也在等一个更稳定的答案。"},
    2025: {stage:"父亲预备期", work:"团队更瘦了，case 更重了，小赵看你的眼神像当年你看老 K。", home:"胎动、学区房和裁员传闻轮流敲门，你不再只替自己做选择。"},
    2026: {stage:"潮水退去期", work:"名单、交接、知识库和沉默的会议邀请逐渐拼成一张完整的图。", home:"产检包放在玄关，手机里的每一次震动都像同时来自医院和 HR。"}
  };

  const outingDest = {
    2018:"山东青岛", 2019:"北京延庆", 2020:"吉林长春", 2021:"河北秦皇岛",
    2022:"辽宁丹东", 2023:"辽宁本溪", 2024:"辽宁营口", 2025:"旅顺口", 2026:"庄河冰峪沟"
  };

  const monthlyHooks = {
    1:"年初的目标设定会上，David 把团队指标投到白板上，所有人的名字都被放进一张新的表格。",
    2:"春节后的办公室还没完全坐满，客户邮件却先一步恢复了速度。",
    3:"三月的绩效自评开始收口，你把过去几个月的 case 重新翻出来，试图给自己找证据。",
    4:"四月的园区风里有海腥味，工会通知和项目升级排期一起弹进邮箱。",
    5:"五月的午休被训练、排练和客户 escalations 切成碎片，大家嘴上抱怨，身体还是去了。",
    6:"年中复盘把所有人的节奏往前推了一格，未关闭的 SBI 像桌面上没喝完的咖啡。",
    7:"七月的空调很冷，会议室里却总有人把话说得越来越热。",
    8:"八月的园区雨水多，工位旁的纸箱开始堆着新设备和旧耳机。",
    9:"九月的 queue 进入新一轮高峰，客户问的是故障，你听见的是预算和人手。",
    10:"十月的风从星海吹到软件园，团队开始提前讨论年末 freeze 和明年的组织架构。",
    11:"十一月的日程像被压缩过，跑步、复盘、排班和家庭安排挤在同一页日历。",
    12:"十二月的灯很亮，年会、绩效和下一年的不确定性一起落在每个人肩上。"
  };

  const trainingHooks2018 = {
    2:"内部培训第二个月，老 K 带你过 CM SAT 基础命令：display station、status trunk、list trace，一边讲一边让你把每一步写进 notebook。",
    3:"三月的培训主题是 severity 判断：NBI、BI、SBI、OTG 的边界，什么时候发 30 分钟 update，什么时候必须拉 war room。",
    6:"六月你第一次正式练 OCD 和 Siebel：认领模拟 SR、补客户沟通记录、上传日志附件、写 closure note，每一步都被 David 退回来改过。",
    9:"九月的内部 lab 把 CM、SM、SMGR、AES 和 gateway 串成一张图。Cruce 说真正的 Backbone 不是记住产品名，是知道问题会从哪里漏出来。",
    10:"十月开始做 shadow shift。你坐在老 K 后面看他处理早班 handover，学会先读客户影响，再看日志，而不是反过来。",
    11:"十一月的英文邮件训练让你头疼：同一句“我们正在调查”，要写得既不空泛，也不把团队锁死在错误承诺里。",
    12:"十二月培训收官，你交出第一份模拟 RCA。David 只批了一句话：能看出你认真，但还不像能独立扛早班的人。"
  };

  const monthScenes = {
    1:["office","💼"], 2:["home","🏮"], 3:["conference","📝"], 4:["goldstone","🧳"],
    5:["sea","🚣"], 6:["warroom","📈"], 7:["desk","💻"], 8:["cafe","🌧"],
    9:["office","📞"], 10:["dalian","🍂"], 11:["city","🏃"], 12:["party","🎄"]
  };

  function choice(label, tag, sub, effects, log){
    return {label, tag, sub, effects, log};
  }

  function makeMonthlyEvent(year, month){
    const arc = arcs[year.year];
    const scene = monthScenes[month] || ["office","📌"];
    const isTraining = year.year === 2018 && trainingHooks2018[month];
    return {
      id:`y${String(year.year).slice(2)}-m${String(month).padStart(2,"0")}`,
      month,
      beat:null,
      title:isTraining ? `${month}月 · 内部培训 · ${arc.stage}` : `${month}月 · ${arc.stage} · 月度回合`,
      scene:scene[0],
      emoji:scene[1],
      body:[
        {type:"narr", text:isTraining ? trainingHooks2018[month] : monthlyHooks[month]},
        {type:"p", text:arc.work},
        {type:"p", text:arc.home}
      ],
      choices:[
        choice(isTraining ? "把培训笔记整理成一页 checklist，发给同届新人" : "把这个月的关键 case 写成复盘，发给团队", "legend", "技术影响力稳步累积",
          {tech:2, comm:1, legend:1, stam:-3}, `${year.year}年${month}月 · 写下月度复盘`),
        choice(isTraining ? "下班后继续在 lab 里重放一遍老师的 demo" : "优先把周末留给家里和自己", "EQ", "状态恢复，但曝光略少",
          {hp:2, family:2, spouse:1, david:-1}, `${year.year}年${month}月 · 留出生活边界`)
      ]
    };
  }

  function makeOutingEvent(year){
    const dest = outingDest[year.year];
    const late = year.year >= 2022;
    return {
      id:`y${String(year.year).slice(2)}-union-outing`,
      month:4,
      beat:null,
      title:`4月 · 工会三天两晚 Outing · ${dest}`,
      scene: late ? "dalian" : "goldstone",
      emoji:"🚌",
      body:[
        {type:"narr", text:`工会组织三天两晚 outing，目的地定在${dest}。`},
        {type:"p", text:late
          ? "预算收紧后，省外大巴游变成了省内短线。HR 说这是“更聚焦团队连接”，老 K 小声说这是“更聚焦成本中心”。"
          : "早些年预算还算宽裕，大家拖着行李箱从软件园出发，车上有人唱歌，有人补觉，有人趁信号好偷偷回客户邮件。"},
        {type:"p", text:"三天两晚里，白天是合影、拓展和饭桌寒暄，晚上才是真正的团队消息交换时间。你听见一些升职传闻，也听见一些关于外包比例的低声讨论。"}
      ],
      choices:[
        choice("主动参加破冰和晚饭局，把跨组同事都认识一遍", "EQ", "关系网变宽，但体力被掏空",
          {comm:2, eq:2, david:2, stam:-8}, `${year.year}年4月 · 工会 outing 主动破冰`),
        choice("白天配合活动，晚上留在房间处理 case 和休息", "legend", "技术线稳定，社交存在感一般",
          {tech:2, hp:2, cruce:1, david:-1}, `${year.year}年4月 · 工会 outing 保持低调`)
      ]
    };
  }

  function makeDragonBoatEvent(year){
    return {
      id:`y${String(year.year).slice(2)}-union-dragonboat`,
      month:5,
      beat:null,
      title:"5月 · 大连市工会划龙舟比赛",
      scene:"sea",
      emoji:"🚣",
      body:[
        {type:"narr", text:"大连市工会把划龙舟比赛安排在 2-6 月活动季里。园区各家公司都派队，Avara Dalian 的队服红得很显眼。"},
        {type:"p", text:"训练地点在海边，鼓点一响，平时在 Webex 里互相 mute 的人忽然要在同一条船上找节奏。"},
        {type:"dialog", who:"Cruce", text:"划龙舟跟救火一样，最怕一个人特别用力，其他人全乱。"}
      ],
      choices:[
        choice("报名上船，跟着鼓点划完全程", "cruce", "团队默契上升，手臂第二天很诚实",
          {stam:-6, hp:1, cruce:3, comm:1}, `${year.year}年5月 · 参加工会龙舟赛`),
        choice("做后勤和摄影，把大家的狼狈剪成一条热视频", "EQ", "不下水也能让大家记住",
          {comm:2, eq:2, david:1}, `${year.year}年5月 · 龙舟赛后勤摄影`)
      ]
    };
  }

  function makeRunEvent(year){
    const month = year.year === 2026 ? 10 : 11;
    return {
      id:`y${String(year.year).slice(2)}-union-run5k`,
      month,
      beat:null,
      title:`${month}月 · 工会 5 公里跑步活动`,
      scene:"city",
      emoji:"🏃",
      body:[
        {type:"narr", text:"工会组织 5 公里跑步活动，路线沿着园区外侧和海边绿道绕一圈。号码布别在胸前，像另一种临时工牌。"},
        {type:"p", text:year.year >= 2024
          ? "这几年队伍明显小了，熟面孔少了不少。起跑前大家还是笑着拍照，只是合影里空出来的位置越来越多。"
          : "那时队伍还很整齐，David 在起点拍手催大家热身，老 K 说自己只是来散步，结果跑得比新人还稳。"},
        {type:"p", text:"跑到第三公里时，你忽然发现工作里的很多坎也是这样：没人替你跑，但有人可以在旁边递水。"}
      ],
      choices:[
        choice("认真跑完全程，最后 500 米还带了同事一把", "legend", "体能和团队声望上升",
          {hp:2, res:2, legend:1, stam:-4}, `${year.year}年${month}月 · 工会 5 公里完赛`),
        choice("陪跑慢组，边跑边听同事吐槽这一年的变化", "EQ", "关系更稳，也听见更多风声",
          {eq:2, comm:1, cruce:2, david:1}, `${year.year}年${month}月 · 工会 5 公里陪跑`)
      ]
    };
  }

  function eventSortKey(ev, order){
    const priority = ev.id && ev.id.indexOf("union-outing") > -1 ? 20
      : ev.id && ev.id.indexOf("union-dragonboat") > -1 ? 30
      : ev.id && ev.id.indexOf("union-run5k") > -1 ? 40
      : ev.beat ? 50
      : 10;
    return (ev.month || 12) * 100 + priority + order / 100;
  }

  CONTENT.years.forEach(year => {
    const expanded = [];
    const originals = (year.events || []).map((ev, order) => {
      const clone = Object.assign({}, ev);
      clone.month = anchorMonths[clone.id] || order + 1;
      clone._order = order;
      return clone;
    });

    for (let month = 1; month <= 12; month++){
      const hasOriginal = originals.some(ev => ev.month === month);
      const hasMandatory = month === 4 || month === 5 || month === (year.year === 2026 ? 10 : 11);
      if (!hasOriginal && !hasMandatory) expanded.push(makeMonthlyEvent(year, month));
    }

    expanded.push(makeOutingEvent(year));
    expanded.push(makeDragonBoatEvent(year));
    expanded.push(makeRunEvent(year));
    expanded.push(...originals);

    year.events = expanded
      .sort((a, b) => eventSortKey(a, a._order || 0) - eventSortKey(b, b._order || 0))
      .map(ev => {
        delete ev._order;
        return ev;
      });
  });
})();

/* =================================================================
 * OCD / Siebel case bank
 * 100 个虚构 SR，题型参考公开 Avaya 文档与论坛常见排障主题后改写。
 * ================================================================= */
CONTENT.caseBank = (() => {
  const products = [
    {name:"Avaya CM", tool:"CM SAT / status station / list trace station", area:"call processing"},
    {name:"Avaya SM", tool:"traceSM / SIP Entity Monitoring / routing test", area:"SIP routing"},
    {name:"Avaya SMGR", tool:"SMGR alarm / DRS / user profile audit", area:"central management"},
    {name:"Avaya AES", tool:"AES OAM / TSAPI / DMCC service status", area:"CTI integration"},
    {name:"Avaya AMS", tool:"AMS service logs / mailbox trace", area:"messaging"},
    {name:"media-gateway", tool:"status media-gateway / list configuration / board alarms", area:"gateway hardware"},
    {name:"AADS", tool:"AADS logs / device sync / service interface", area:"device services"},
    {name:"security", tool:"certificate store / TLS handshake / firewall logs", area:"security"},
    {name:"endpoint phone", tool:"phone registration / DHCP option / firmware log", area:"endpoint"},
    {name:"SIP trunk", tool:"SIP ladder / SBC trace / route pattern", area:"trunk routing"}
  ];

  const scenarios = [
    {sev:"NBI", symptom:"single user cannot register after password reset", evidence:"OCD shows one extension affected; Siebel has no site outage flag.",
      correct:"Check user profile, authentication password, station security code and registration status before changing routing.",
      partial:"Ask the customer to reboot the endpoint and collect fresh registration logs.",
      neutral:"Move the SR to monitoring and wait for another occurrence.",
      bad:"Restart the whole application stack for a single-user registration issue."},
    {sev:"NBI", symptom:"customer asks why a feature button disappeared after template change", evidence:"Only new hires using the latest template report the issue.",
      correct:"Compare the endpoint/station template with a known good user and correct the button assignment.",
      partial:"Clone an older working profile for the affected user and document the template gap.",
      neutral:"Tell the customer the feature is unsupported without checking the template.",
      bad:"Delete and recreate the user without preserving current assignments."},
    {sev:"BI", symptom:"intermittent one-way audio on internal transfers", evidence:"SIP ladder is clean but RTP path changes after transfer.",
      correct:"Validate network region, codec set, media shuffling and gateway/RTP path before blaming endpoints.",
      partial:"Disable media shuffling as a temporary workaround and schedule RCA.",
      neutral:"Collect another trace only after the next user complaint.",
      bad:"Change trunk signaling group settings during business hours without rollback."},
    {sev:"BI", symptom:"CTI screen-pop stops for a subset of agents", evidence:"Calls arrive, but the desktop app loses event stream after agent login.",
      correct:"Check AES TSAPI/DMCC service, CTI link status, agent login mapping and application session limits.",
      partial:"Restart the affected CTI client group after confirming calls are not blocked.",
      neutral:"Ask agents to relogin every hour as a workaround.",
      bad:"Busyout the hunt group to test CTI behavior during production peak."},
    {sev:"SBI", symptom:"major branch reports outbound PSTN failures", evidence:"Inbound calls work; outbound fails after route selection.",
      correct:"Trace the failed call, verify route pattern/ARS, trunk group status and carrier response code.",
      partial:"Route critical calls through an alternate trunk group and keep the SR open for RCA.",
      neutral:"Ask the carrier to investigate without sending trace evidence.",
      bad:"Reset all trunks and gateways without isolating the failed route."},
    {sev:"SBI", symptom:"large user group cannot log in after certificate renewal", evidence:"TLS handshake failures start at the renewal window.",
      correct:"Verify certificate chain, trust store, service binding and restart only the affected secure service if needed.",
      partial:"Temporarily fail traffic to a node with a valid certificate while preparing the fix.",
      neutral:"Tell the customer to bypass TLS permanently.",
      bad:"Import a self-signed certificate into production without approval."},
    {sev:"OTG", symptom:"site-wide call processing outage after maintenance", evidence:"Multiple alarms, failed registrations, and customers opening duplicate SRs.",
      correct:"Declare war room, identify last change, collect core alarms/traces, restore known-good path, then RCA.",
      partial:"Rollback the most recent approved change and keep bridge updates every 30 minutes.",
      neutral:"Work only the first Siebel SR and ignore duplicate outage reports.",
      bad:"Make several unrelated config changes while the outage bridge is live."},
    {sev:"OTG", symptom:"all SIP calls fail between enterprise and carrier", evidence:"OPTIONS/INVITE flow stops at the edge after firewall change.",
      correct:"Validate SIP entity links, firewall/NAT path, TLS/SRTP policy and carrier reachability using trace evidence.",
      partial:"Fail traffic to the backup carrier route while network restores the primary path.",
      neutral:"Ask users to use mobile phones until tomorrow.",
      bad:"Disable SIP security globally to see if calls come back."},
    {sev:"BI", symptom:"voicemail or messaging notification delay impacts executives", evidence:"Messages are stored, but notification events queue for 20 minutes.",
      correct:"Check messaging service queue, integration account, event delivery and recent mailbox policy changes.",
      partial:"Manually flush/restart the notification worker after saving current queue evidence.",
      neutral:"Close as cosmetic because messages are eventually delivered.",
      bad:"Purge the queue without customer approval or backup."},
    {sev:"NBI", symptom:"new phone model shows wrong time and locale", evidence:"Only one subnet and one firmware load are affected.",
      correct:"Check DHCP/time server, location profile, firmware compatibility and endpoint locale settings.",
      partial:"Manually correct a VIP phone and schedule subnet template cleanup.",
      neutral:"Ask users to ignore the display until next patch cycle.",
      bad:"Factory reset all phones in the subnet during office hours."}
  ];

  const cases = [];
  products.forEach((product, pIdx) => {
    scenarios.forEach((scenario, sIdx) => {
      const n = pIdx * scenarios.length + sIdx + 1;
      cases.push({
        id:`SR-${String(n).padStart(3, "0")}`,
        product:product.name,
        severity:scenario.sev,
        area:product.area,
        tool:product.tool,
        title:`${scenario.sev} · ${product.name} · ${scenario.symptom}`,
        prompt:`OCD 分配 ${scenario.sev} case：${product.name} 出现 ${scenario.symptom}。Siebel 摘要：${scenario.evidence} 你会如何处理？`,
        choices:[
          {score:2, label:scenario.correct, sub:"最佳：先定位影响面和证据链，再执行最小变更。"},
          {score:1, label:scenario.partial, sub:"次优：能止血，但需要补 RCA / follow-up。"},
          {score:0, label:scenario.neutral, sub:"中间：不扩大事故，但没有有效推进。"},
          {score:-1, label:scenario.bad, sub:"最差：高风险、无证据或违反 SR 处理规范。"}
        ]
      });
    });
  });
  return cases;
})();

CONTENT.injectMonthlyCases = function injectMonthlyCases(seed){
  const rand = (n) => {
    let x = Math.sin(n * 9301 + seed * 49297) * 233280;
    return x - Math.floor(x);
  };
  const pickCases = (year, month) => {
    const ranked = CONTENT.caseBank
      .map((c, idx) => ({c, r: rand(year * 10000 + month * 100 + idx)}))
      .sort((a, b) => a.r - b.r)
      .slice(0, 3)
      .map(x => x.c);
    return ranked;
  };
  const rotateChoices = (choices, offset) => choices
    .map((c, idx) => choices[(idx + offset) % choices.length]);

  const makeCaseNo = (year, month, slot, srId) => {
    const base = year * 10000 + month * 100 + slot * 17 + parseInt(srId.replace(/\D/g, ""), 10);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    if (rand(base) > 0.74){
      let n = "";
      for (let i = 0; i < 11; i++) n += Math.floor(rand(base + i * 13) * 10);
      return `1-${n}`;
    }
    let id = "";
    for (let i = 0; i < 7; i++) id += chars[Math.floor(rand(base + i * 19) * chars.length)];
    return `1-${id}`;
  };

  CONTENT.years.forEach(year => {
    year.events = (year.events || []).filter(ev => !ev.isCase);
    if (year.year < 2019) return;
    const additions = [];
    for (let month = 1; month <= 12; month++){
      pickCases(year.year, month).forEach((sr, slot) => {
        const order = (year.year + month + slot) % 4;
        const caseNo = makeCaseNo(year.year, month, slot + 1, sr.id);
        additions.push({
          id:`case-${year.year}-${String(month).padStart(2, "0")}-${slot + 1}-${sr.id}`,
          isCase:true,
          month,
          caseId:sr.id,
          caseNo,
          severity:sr.severity,
          product:sr.product,
          beat:"OCD / Siebel 日常 SR",
          title:`${month}月 · OCD 早班 Case ${slot + 1} · ${sr.product}`,
          scene: sr.severity === "OTG" ? "warroom" : sr.severity === "SBI" ? "conference" : "desk",
          emoji: sr.severity === "OTG" ? "🚨" : sr.severity === "SBI" ? "🔥" : "📟",
          body:[
            {type:"narr", text:`06:00-15:00 早班。你打开 OCD，系统把 ${caseNo} 推到你的队列；后端 Siebel SR 已经自动关联客户影响、附件和上一班 handover。`},
            {type:"p", text:sr.prompt},
            {type:"quote", text:`Case: ${caseNo} · Severity: ${sr.severity} · Product: ${sr.product} · Tooling: ${sr.tool}`}
          ],
          choices: rotateChoices(sr.choices, order).map(ch => ({
            label:ch.label,
            tag: ch.score === 2 ? "legend" : ch.score < 0 ? "danger" : "EQ",
            sub:`${ch.sub} Case score ${ch.score > 0 ? "+" : ""}${ch.score}`,
            effects:{
              caseScore:ch.score,
              tech: ch.score === 2 ? 1 : 0,
              comm: ch.score === 1 ? 1 : 0,
              legend: ch.score === 2 && sr.severity !== "NBI" ? 1 : 0,
              david: ch.score < 0 ? -2 : 0,
              hp: ch.score < 0 ? -1 : 0
            },
            log:`${year.year}-${String(month).padStart(2, "0")} · ${caseNo} · ${sr.product} · ${ch.score > 0 ? "推进" : ch.score === 0 ? "未闭环" : "失误"}`
          }))
        });
      });
    }

    year.events = year.events.concat(additions).sort((a, b) => {
      const pa = a.isCase ? 60 + Number(a.id.split("-")[3] || 0) : a.beat ? 50 : a.id && a.id.indexOf("union-") > -1 ? 30 : 10;
      const pb = b.isCase ? 60 + Number(b.id.split("-")[3] || 0) : b.beat ? 50 : b.id && b.id.indexOf("union-") > -1 ? 30 : 10;
      return (a.month || 12) * 100 + pa - ((b.month || 12) * 100 + pb);
    });
  });
};
