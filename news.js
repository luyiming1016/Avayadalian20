/* ============================================================
 *  news.js · 当月新闻简报数据
 *  每条 { y:年, m:月, scope:类别, t:标题, u:URL }
 *  缺失月份用 Wikipedia 月份页面兜底
 * ============================================================ */

const NEWS_EVENTS = [
  // ===== 2018 =====
  {y:2018, m:1, scope:"国际", t:"南非开普敦面临 “零水日” 用水危机", u:"https://zh.wikipedia.org/wiki/2018%E5%B9%B4%E5%BC%80%E6%99%AE%E6%95%A6%E7%94%A8%E6%B0%B4%E5%8D%B1%E6%9C%BA"},
  {y:2018, m:2, scope:"国际", t:"平昌冬奥会在韩国开幕", u:"https://zh.wikipedia.org/wiki/2018%E5%B9%B4%E5%86%AC%E5%AD%A3%E5%A5%A5%E6%9E%97%E5%8C%B9%E5%85%8B%E8%BF%90%E5%8A%A8%E4%BC%9A"},
  {y:2018, m:3, scope:"国内", t:"十三届全国人大一次会议通过宪法修正案", u:"https://zh.wikipedia.org/wiki/2018%E5%B9%B4%E4%B8%AD%E5%8D%8E%E4%BA%BA%E6%B0%91%E5%85%B1%E5%92%8C%E5%9B%BD%E5%AE%AA%E6%B3%95%E4%BF%AE%E6%AD%A3%E6%A1%88"},
  {y:2018, m:4, scope:"国际", t:"南北韩首脑文金会于板门店举行", u:"https://zh.wikipedia.org/wiki/2018%E5%B9%B4%E5%8D%97%E5%8C%97%E9%9F%93%E9%AB%98%E5%B3%B0%E4%BC%9A"},
  {y:2018, m:6, scope:"国际", t:"特朗普与金正恩首次新加坡会晤", u:"https://zh.wikipedia.org/wiki/2018%E5%B9%B4%E6%9C%9D%E7%BE%8E%E9%A6%96%E8%84%91%E4%BC%9A%E6%99%A4"},
  {y:2018, m:7, scope:"国内", t:"长春长生疫苗事件曝光，引发监管整顿", u:"https://zh.wikipedia.org/wiki/2018%E5%B9%B4%E9%95%BF%E6%98%A5%E9%95%BF%E7%94%9F%E7%94%9F%E7%89%A9%E7%96%AB%E8%8B%97%E4%BA%8B%E4%BB%B6"},
  {y:2018, m:7, scope:"国际", t:"中美贸易战正式开打，互加 25% 关税", u:"https://zh.wikipedia.org/wiki/%E4%B8%AD%E7%BE%8E%E8%B2%BF%E6%98%93%E6%88%B0"},
  {y:2018, m:10, scope:"国内", t:"重庆万州公交车坠江事故", u:"https://zh.wikipedia.org/wiki/%E9%87%8D%E6%85%B6%E4%B8%87%E5%B7%9E%E5%85%AC%E4%BA%A4%E8%BD%A6%E5%9D%A0%E6%B1%9F%E4%BA%8B%E4%BB%B6"},
  {y:2018, m:11, scope:"国内", t:"首届中国国际进口博览会在上海开幕", u:"https://zh.wikipedia.org/wiki/%E4%B8%AD%E5%9B%BD%E5%9B%BD%E9%99%85%E8%BF%9B%E5%8F%A3%E5%8D%9A%E8%A7%88%E4%BC%9A"},
  {y:2018, m:12, scope:"国际", t:"华为孟晚舟在加拿大温哥华被捕", u:"https://zh.wikipedia.org/wiki/%E5%AD%9F%E6%99%9A%E8%88%9F%E4%BA%8B%E4%BB%B6"},

  // ===== 2019 =====
  {y:2019, m:1, scope:"科技", t:"嫦娥四号实现人类首次月球背面软着陆", u:"https://zh.wikipedia.org/wiki/%E5%AB%A6%E5%A8%A5%E5%9B%9B%E5%8F%B7"},
  {y:2019, m:3, scope:"国际", t:"埃塞俄比亚航空 302 号班机失事，波音 737 MAX 全球停飞", u:"https://zh.wikipedia.org/wiki/%E5%9F%83%E5%A1%9E%E4%BF%84%E6%AF%94%E4%BA%9A%E8%88%AA%E7%A9%BA302%E5%8F%B7%E7%8F%AD%E6%9C%BA%E7%A9%BA%E9%9A%BE"},
  {y:2019, m:4, scope:"国际", t:"巴黎圣母院发生大火，尖塔倒塌", u:"https://zh.wikipedia.org/wiki/2019%E5%B9%B4%E5%B7%B4%E9%BB%8E%E5%9C%A3%E6%AF%8D%E9%99%A2%E5%A4%A7%E7%81%AB"},
  {y:2019, m:6, scope:"国际", t:"香港反对《逃犯条例》修订草案运动爆发", u:"https://zh.wikipedia.org/wiki/2019%E5%B9%B4%E2%80%942020%E5%B9%B4%E9%A6%99%E6%B8%AF%E5%8F%8D%E9%80%81%E4%B8%AD%E9%81%8B%E5%8B%95"},
  {y:2019, m:7, scope:"国内", t:"上海正式实施生活垃圾强制分类", u:"https://zh.wikipedia.org/wiki/%E4%B8%8A%E6%B5%B7%E5%B8%82%E7%94%9F%E6%B4%BB%E5%9E%83%E5%9C%BE%E7%AE%A1%E7%90%86%E6%9D%A1%E4%BE%8B"},
  {y:2019, m:7, scope:"国际", t:"阿波罗 11 号登月 50 周年纪念", u:"https://zh.wikipedia.org/wiki/%E9%98%BF%E6%B3%A2%E7%BD%9711%E5%8F%B7"},
  {y:2019, m:7, scope:"国内", t:"浙江温岭油罐车爆炸事故", u:"https://zh.wikipedia.org/wiki/2019%E5%B9%B4%E6%B8%A9%E5%B2%AD%E6%B2%B9%E7%BD%90%E8%BD%A6%E7%88%86%E7%82%B8%E4%BA%8B%E6%95%85"},
  {y:2019, m:8, scope:"国际", t:"亚马逊雨林大火持续延烧", u:"https://zh.wikipedia.org/wiki/2019%E5%B9%B4%E4%BA%9A%E9%A9%AC%E9%80%8A%E9%9B%A8%E6%9E%97%E7%81%AB%E7%81%BE"},
  {y:2019, m:10, scope:"国内", t:"庆祝中华人民共和国成立 70 周年大会在天安门广场举行", u:"https://zh.wikipedia.org/wiki/%E4%B8%AD%E5%8D%8E%E4%BA%BA%E6%B0%91%E5%85%B1%E5%92%8C%E5%9B%BD%E6%88%90%E7%AB%8B70%E5%91%A8%E5%B9%B4%E5%BA%86%E7%A5%9D%E6%B4%BB%E5%8A%A8"},
  {y:2019, m:12, scope:"国际", t:"武汉报告不明原因肺炎病例，COVID-19 首次浮出水面", u:"https://zh.wikipedia.org/wiki/%E5%86%A0%E7%8A%B6%E7%97%85%E6%AF%92%E7%97%85"},

  // ===== 2020 =====
  {y:2020, m:1, scope:"国内", t:"武汉宣布封城，COVID-19 在中国大规模爆发", u:"https://zh.wikipedia.org/wiki/2020%E5%B9%B4%E6%AD%A6%E6%B1%89%E5%B0%81%E5%9F%8E"},
  {y:2020, m:1, scope:"国际", t:"NBA 球星科比·布莱恩特直升机失事身亡", u:"https://zh.wikipedia.org/wiki/%E7%A7%91%E6%AF%94%C2%B7%E5%B8%83%E8%8E%B1%E6%81%A9%E7%89%B9"},
  {y:2020, m:3, scope:"国际", t:"世卫组织宣布 COVID-19 全球大流行", u:"https://zh.wikipedia.org/wiki/2019%E5%86%A0%E7%8A%B6%E7%97%85%E6%AF%92%E7%97%85"},
  {y:2020, m:5, scope:"国际", t:"乔治·弗洛伊德事件引发全球反种族歧视抗议", u:"https://zh.wikipedia.org/wiki/%E5%96%AC%E6%B2%BB%C2%B7%E5%BC%97%E6%B4%9B%E4%BC%8A%E5%BE%B7%E4%B9%8B%E6%AD%BB"},
  {y:2020, m:6, scope:"国内", t:"全国人大通过《港版国安法》", u:"https://zh.wikipedia.org/wiki/%E4%B8%AD%E5%8D%8E%E4%BA%BA%E6%B0%91%E5%85%B1%E5%92%8C%E5%9B%BD%E9%A6%99%E6%B8%AF%E7%89%B9%E5%88%AB%E8%A1%8C%E6%94%BF%E5%8C%BA%E7%BB%B4%E6%8A%A4%E5%9B%BD%E5%AE%B6%E5%AE%89%E5%85%A8%E6%B3%95"},
  {y:2020, m:7, scope:"国内", t:"火星探测器 “天问一号” 发射成功", u:"https://zh.wikipedia.org/wiki/%E5%A4%A9%E9%97%AE%E4%B8%80%E5%8F%B7"},
  {y:2020, m:8, scope:"国际", t:"黎巴嫩贝鲁特港口大爆炸", u:"https://zh.wikipedia.org/wiki/2020%E5%B9%B4%E8%B4%9D%E9%B2%81%E7%89%B9%E7%88%86%E7%82%B8%E4%BA%8B%E4%BB%B6"},
  {y:2020, m:11, scope:"国际", t:"美国大选拜登击败特朗普，正式赢得总统", u:"https://zh.wikipedia.org/wiki/2020%E5%B9%B4%E7%BE%8E%E5%9B%BD%E6%80%BB%E7%BB%9F%E9%80%89%E4%B8%BE"},
  {y:2020, m:11, scope:"国内", t:"《区域全面经济伙伴关系协定》（RCEP）正式签署", u:"https://zh.wikipedia.org/wiki/%E5%8C%BA%E5%9F%9F%E5%85%A8%E9%9D%A2%E7%BB%8F%E6%B5%8E%E4%BC%99%E4%BC%B4%E5%85%B3%E7%B3%BB%E5%8D%8F%E5%AE%9A"},
  {y:2020, m:12, scope:"科技", t:"嫦娥五号成功带回月球样品", u:"https://zh.wikipedia.org/wiki/%E5%AB%A6%E5%A8%A5%E4%BA%94%E5%8F%B7"},

  // ===== 2021 =====
  {y:2021, m:1, scope:"国际", t:"美国国会大厦遭支持者冲击", u:"https://zh.wikipedia.org/wiki/2021%E5%B9%B4%E7%BE%8E%E5%9B%BD%E5%9B%BD%E4%BC%9A%E5%A4%A7%E5%8E%A6%E8%A2%AD%E5%87%BB%E4%BA%8B%E4%BB%B6"},
  {y:2021, m:2, scope:"国际", t:"缅甸军方发动政变，昂山素季被拘", u:"https://zh.wikipedia.org/wiki/2021%E5%B9%B4%E7%BC%85%E7%94%B8%E6%94%BF%E5%8F%98"},
  {y:2021, m:2, scope:"国内", t:"中央宣布脱贫攻坚战取得全面胜利", u:"https://zh.wikipedia.org/wiki/%E4%B8%AD%E5%9B%BD%E8%84%B1%E8%B4%AB"},
  {y:2021, m:3, scope:"国际", t:"长赐号货轮搁浅，苏伊士运河堵塞 6 天", u:"https://zh.wikipedia.org/wiki/2021%E5%B9%B4%E8%8B%8F%E4%BC%8A%E5%A3%AB%E8%BF%90%E6%B2%B3%E5%A0%B5%E5%A1%9E%E4%BA%8B%E4%BB%B6"},
  {y:2021, m:5, scope:"科技", t:"天问一号 “祝融号” 火星车成功着陆", u:"https://zh.wikipedia.org/wiki/%E7%A5%9D%E8%9E%8D%E5%8F%B7%E7%81%AB%E6%98%9F%E8%BD%A6"},
  {y:2021, m:7, scope:"国内", t:"郑州 “7·20” 特大暴雨灾害", u:"https://zh.wikipedia.org/wiki/2021%E5%B9%B4%E6%B2%B3%E5%8D%97%E6%9A%B4%E9%9B%A8"},
  {y:2021, m:7, scope:"国际", t:"东京奥运会推迟一年后开幕", u:"https://zh.wikipedia.org/wiki/2020%E5%B9%B4%E5%A4%8F%E5%AD%A3%E5%A5%A5%E6%9E%97%E5%8C%B9%E5%85%8B%E8%BF%90%E5%8A%A8%E4%BC%9A"},
  {y:2021, m:8, scope:"国际", t:"塔利班重新控制阿富汗喀布尔", u:"https://zh.wikipedia.org/wiki/2021%E5%B9%B4%E5%A1%94%E5%88%A9%E7%8F%AD%E6%94%BB%E5%8A%BF"},
  {y:2021, m:11, scope:"国际", t:"COP26 气候大会在格拉斯哥召开", u:"https://zh.wikipedia.org/wiki/2021%E5%B9%B4%E8%81%94%E5%90%88%E5%9B%BD%E6%B0%94%E5%80%99%E5%8F%98%E5%8C%96%E5%A4%A7%E4%BC%9A"},

  // ===== 2022 =====
  {y:2022, m:2, scope:"国内", t:"北京冬奥会开幕", u:"https://zh.wikipedia.org/wiki/2022%E5%B9%B4%E5%86%AC%E5%AD%A3%E5%A5%A5%E6%9E%97%E5%8C%B9%E5%85%8B%E8%BF%90%E5%8A%A8%E4%BC%9A"},
  {y:2022, m:2, scope:"国际", t:"俄罗斯入侵乌克兰，俄乌战争爆发", u:"https://zh.wikipedia.org/wiki/2022%E5%B9%B4%E4%BF%84%E7%BD%97%E6%96%AF%E5%85%A5%E4%BE%B5%E4%B9%8C%E5%85%8B%E5%85%B0"},
  {y:2022, m:3, scope:"国内", t:"东方航空 MU5735 客机失事", u:"https://zh.wikipedia.org/wiki/%E4%B8%9C%E6%96%B9%E8%88%AA%E7%A9%BA5735%E5%8F%B7%E7%8F%AD%E6%9C%BA%E7%A9%BA%E9%9A%BE"},
  {y:2022, m:7, scope:"国际", t:"日本前首相安倍晋三遇刺身亡", u:"https://zh.wikipedia.org/wiki/%E5%AE%89%E5%80%8D%E6%99%8B%E4%B8%89%E9%81%87%E5%88%BA%E6%A1%88"},
  {y:2022, m:8, scope:"国际", t:"美国众议院议长佩洛西访台引发台海紧张", u:"https://zh.wikipedia.org/wiki/%E4%BD%A9%E6%B4%9B%E8%A5%BF%E8%AE%BF%E5%8F%B0"},
  {y:2022, m:9, scope:"国际", t:"英国女王伊丽莎白二世逝世", u:"https://zh.wikipedia.org/wiki/%E4%BC%8A%E4%B8%BD%E8%8E%8E%E7%99%BD%E4%BA%8C%E4%B8%96%E4%B9%8B%E6%AD%BB%E5%8F%8A%E5%9C%8B%E8%91%AC"},
  {y:2022, m:10, scope:"国内", t:"中共二十大召开，习近平连任总书记", u:"https://zh.wikipedia.org/wiki/%E4%B8%AD%E5%9B%BD%E5%85%B1%E4%BA%A7%E5%85%9A%E7%AC%AC%E4%BA%8C%E5%8D%81%E6%AC%A1%E5%85%A8%E5%9B%BD%E4%BB%A3%E8%A1%A8%E5%A4%A7%E4%BC%9A"},
  {y:2022, m:11, scope:"科技", t:"OpenAI 发布 ChatGPT，引发生成式 AI 浪潮", u:"https://zh.wikipedia.org/wiki/ChatGPT"},
  {y:2022, m:11, scope:"国际", t:"卡塔尔世界杯开幕，阿根廷夺冠", u:"https://zh.wikipedia.org/wiki/2022%E5%B9%B4%E5%9B%BD%E9%99%85%E8%B6%B3%E8%81%94%E4%B8%96%E7%95%8C%E6%9D%AF"},
  {y:2022, m:12, scope:"国内", t:"国务院发布 “新十条”，全面调整防疫政策", u:"https://zh.wikipedia.org/wiki/%E5%9B%9B%E9%80%9A%E5%8D%81%E6%9D%A1"},

  // ===== 2023 =====
  {y:2023, m:1, scope:"国内", t:"中国正式开放出入境，结束新冠隔离政策", u:"https://zh.wikipedia.org/wiki/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E9%99%86%E5%AF%B9COVID-19%E7%96%AB%E6%83%85%E7%9A%84%E5%BA%94%E5%AF%B9"},
  {y:2023, m:2, scope:"国际", t:"土耳其—叙利亚发生 7.8 级强烈地震", u:"https://zh.wikipedia.org/wiki/2023%E5%B9%B4%E5%9C%9F%E8%80%B3%E5%85%B6%E2%80%93%E5%8F%99%E5%88%A9%E4%BA%9A%E5%A4%A7%E5%9C%B0%E9%9C%87"},
  {y:2023, m:2, scope:"国际", t:"美国击落中国 “流浪” 高空气球", u:"https://zh.wikipedia.org/wiki/2023%E5%B9%B4%E4%B8%AD%E5%9B%BD%E6%B0%94%E7%90%83%E4%BA%8B%E4%BB%B6"},
  {y:2023, m:3, scope:"国际", t:"硅谷银行倒闭，引发美国中小银行危机", u:"https://zh.wikipedia.org/wiki/%E7%A1%85%E8%B0%B7%E9%93%B6%E8%A1%8C%E5%80%92%E9%97%AD%E4%BA%8B%E4%BB%B6"},
  {y:2023, m:3, scope:"国际", t:"习近平赴莫斯科国事访问普京", u:"https://zh.wikipedia.org/wiki/2023%E5%B9%B4%E4%B9%A0%E8%BF%91%E5%B9%B3%E8%AE%BF%E4%BF%84"},
  {y:2023, m:5, scope:"国内", t:"C919 国产大飞机完成首次商业载客飞行", u:"https://zh.wikipedia.org/wiki/%E4%B8%AD%E5%9B%BD%E5%95%86%E9%A3%9EC919"},
  {y:2023, m:7, scope:"国际", t:"好莱坞编剧与演员双罢工开始", u:"https://zh.wikipedia.org/wiki/2023%E5%B9%B4%E5%A5%BD%E8%8E%B1%E5%9D%9E%E5%8A%B3%E8%B5%84%E7%BA%A0%E7%BA%B7"},
  {y:2023, m:9, scope:"国内", t:"杭州亚运会开幕", u:"https://zh.wikipedia.org/wiki/2022%E5%B9%B4%E4%BA%9A%E6%B4%B2%E8%BF%90%E5%8A%A8%E4%BC%9A"},
  {y:2023, m:10, scope:"国际", t:"哈马斯袭击以色列，加沙战争爆发", u:"https://zh.wikipedia.org/wiki/2023%E5%B9%B4%E4%BB%A5%E8%89%B2%E5%88%97%E2%80%93%E5%93%88%E9%A9%AC%E6%96%AF%E6%88%98%E4%BA%89"},
  {y:2023, m:12, scope:"国内", t:"甘肃积石山发生 6.2 级地震", u:"https://zh.wikipedia.org/wiki/2023%E5%B9%B4%E7%94%98%E8%82%83%E7%A7%AF%E7%9F%B3%E5%B1%B1%E5%9C%B0%E9%9C%87"},

  // ===== 2024 =====
  {y:2024, m:1, scope:"国际", t:"日本能登半岛发生 7.6 级地震", u:"https://zh.wikipedia.org/wiki/2024%E5%B9%B4%E8%83%BD%E7%99%BB%E5%8D%8A%E5%B2%9B%E5%9C%B0%E9%9C%87"},
  {y:2024, m:1, scope:"国际", t:"赖清德当选台湾地区领导人", u:"https://zh.wikipedia.org/wiki/2024%E5%B9%B4%E4%B8%AD%E5%8D%8E%E6%B0%91%E5%9B%BD%E6%80%BB%E7%BB%9F%E9%80%89%E4%B8%BE"},
  {y:2024, m:3, scope:"国际", t:"美国巴尔的摩弗朗西斯·斯科特·基大桥撞塌", u:"https://zh.wikipedia.org/wiki/%E5%BC%97%E6%9C%97%E8%A5%BF%E6%96%AF%C2%B7%E6%96%AF%E7%A7%91%E7%89%B9%C2%B7%E5%9F%BA%E5%A4%A7%E6%A1%A5%E5%80%92%E5%A1%8C%E4%BA%8B%E6%95%85"},
  {y:2024, m:4, scope:"科技", t:"神舟十八号载人飞船升空", u:"https://zh.wikipedia.org/wiki/%E7%A5%9E%E8%88%9F%E5%8D%81%E5%85%AB%E5%8F%B7"},
  {y:2024, m:6, scope:"科技", t:"嫦娥六号实现人类首次月背采样返回", u:"https://zh.wikipedia.org/wiki/%E5%AB%A6%E5%A8%A5%E5%85%AD%E5%8F%B7"},
  {y:2024, m:7, scope:"国际", t:"特朗普在宾州集会遇袭，耳部受伤", u:"https://zh.wikipedia.org/wiki/2024%E5%B9%B4%E5%94%90%E7%BA%B3%E5%BE%B7%C2%B7%E7%89%B9%E6%9C%97%E6%99%AE%E9%81%87%E5%88%BA%E6%A1%88"},
  {y:2024, m:7, scope:"国际", t:"巴黎奥运会开幕", u:"https://zh.wikipedia.org/wiki/2024%E5%B9%B4%E5%A4%8F%E5%AD%A3%E5%A5%A5%E6%9E%97%E5%8C%B9%E5%85%8B%E8%BF%90%E5%8A%A8%E4%BC%9A"},
  {y:2024, m:7, scope:"国际", t:"美国总统拜登宣布退出连任竞选", u:"https://zh.wikipedia.org/wiki/2024%E5%B9%B4%E7%BE%8E%E5%9B%BD%E6%80%BB%E7%BB%9F%E9%80%89%E4%B8%BE"},
  {y:2024, m:11, scope:"国际", t:"特朗普赢得 2024 美国大选，重返白宫", u:"https://zh.wikipedia.org/wiki/2024%E5%B9%B4%E7%BE%8E%E5%9B%BD%E6%80%BB%E7%BB%9F%E9%80%89%E4%B8%BE"},
  {y:2024, m:12, scope:"国际", t:"叙利亚阿萨德政权倒台", u:"https://zh.wikipedia.org/wiki/2024%E5%B9%B4%E5%8F%99%E5%88%A9%E4%BA%9A%E5%8F%8D%E6%94%BF%E5%BA%9C%E6%94%BB%E5%8A%BF"},

  // ===== 2025 =====
  {y:2025, m:1, scope:"国际", t:"加州洛杉矶山火造成大规模疏散", u:"https://zh.wikipedia.org/wiki/2025%E5%B9%B4%E5%8A%A0%E5%88%A9%E7%A6%8F%E5%B0%BC%E4%BA%9A%E5%B1%B1%E7%81%AB"},
  {y:2025, m:1, scope:"国际", t:"特朗普第二次就任美国总统", u:"https://zh.wikipedia.org/wiki/%E5%94%90%E7%BA%B3%E5%BE%B7%C2%B7%E7%89%B9%E6%9C%97%E6%99%AE%E7%AC%AC%E4%BA%8C%E4%BB%BB%E6%80%BB%E7%BB%9F%E4%BB%BB%E6%9C%9F"},
  {y:2025, m:1, scope:"科技", t:"DeepSeek-R1 发布，引爆中美 AI 推理模型竞赛", u:"https://zh.wikipedia.org/wiki/DeepSeek"},
  {y:2025, m:3, scope:"国际", t:"美对全球加征 “对等关税”，引爆贸易战", u:"https://zh.wikipedia.org/wiki/2025%E5%B9%B4%E7%BE%8E%E5%9B%BD%E5%85%B3%E7%A8%8E%E6%94%BF%E7%AD%96"},
  {y:2025, m:4, scope:"国际", t:"教宗方济各去世", u:"https://zh.wikipedia.org/wiki/%E6%96%B9%E6%B5%8E%E5%90%84"}
];

const NEWS_MONTH_CN = ["","一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"];
const NEWS_MONTH_EN = ["","January","February","March","April","May","June","July","August","September","October","November","December"];

function _newsRngFor(year, month){
  // 简易确定性随机：同一年月每次抽到相同的 5 条
  let seed = year * 100 + month;
  return function(){
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

function _newsShuffle(arr, rng){
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--){
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getNewsForMonth(year, month){
  if (typeof year !== "number" || typeof month !== "number") return [];
  const rng = _newsRngFor(year, month);
  const exact = NEWS_EVENTS.filter(n => n.y === year && n.m === month);
  let pool = _newsShuffle(exact, rng);
  if (pool.length < 5){
    const sameYear = NEWS_EVENTS.filter(n => n.y === year && n.m !== month);
    pool = pool.concat(_newsShuffle(sameYear, rng));
  }
  if (pool.length < 5){
    const nearby = NEWS_EVENTS.filter(n => Math.abs(n.y - year) <= 1 && !(n.y === year));
    pool = pool.concat(_newsShuffle(nearby, rng));
  }
  // 兜底：维基百科月份汇总 + 年汇总
  const monthCn = NEWS_MONTH_CN[month] || "";
  const monthEn = NEWS_MONTH_EN[month] || "";
  const fallback = [
    {scope:"百科", t:`维基百科 · ${year}年${month}月汇总`, u:`https://zh.wikipedia.org/wiki/${year}年${month}月`},
    {scope:"WIKI",  t:`Wikipedia · ${monthEn} ${year}`,     u:`https://en.wikipedia.org/wiki/${monthEn}_${year}`}
  ];
  // 去重 by URL
  const seen = new Set(pool.map(x => x.u));
  fallback.forEach(f => { if (!seen.has(f.u)){ pool.push(f); seen.add(f.u); }});
  return pool.slice(0, 5);
}
