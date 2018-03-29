const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function regexConfig() {
  var reg = {
    email: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
    phone: /^1(3|4|5|7|8)\d{9}$/
  }
  return reg;
}
const xz_list =x=>{
  let xz_list= [
    { value: "001", label: "购销系统" },
    {
      value: "002",
      label: "OA系统"
    },
    {
      value: "003",
      label: "设备系统"
    },
    {
      value: "004",
      label: "人事系统"
    },
    {
      value: "005",
      label: "仓库系统"
    },
    {
      value: "006",
      label: "ERP集成"
    },
    {
      value: "007",
      label: "资金应付"
    },
    {
      value: "008",
      label: "国贸ERP"
    },
    {
      value: "009",
      label: "仓库PDA"
    },
    {
      value: "010",
      label: "外网邮箱"
    },
    {
      value: "011",
      label: "其他系统"
    }
  ];
  return xz_list;
}
module.exports = {
  formatTime: formatTime,
  regexConfig: regexConfig,
  xz_list: xz_list
}
