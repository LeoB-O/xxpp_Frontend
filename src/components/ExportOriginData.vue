<template>
  <div class="block">
    <span class="demonstration">选择导出数据的时间范围</span>
    <el-date-picker
      v-model="value1"
      type="daterange"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期">
    </el-date-picker>
    <el-button type="primary" @click="handleConfirm">确 定</el-button>
  </div>
</template>

<script>
  import XLSX from 'xlsx'
  import {getOrders, getOrdersByTime} from "../api/order";

  export default {
    name: "ExportOriginData",
    data: function () {
      return {
        value1: ''
      }
    },
    created: function () {

    },
    methods: {
      createSheet: async function () {
        let ret = await getOrdersByTime(this.value1[0], this.value1[1]).then(response => {
          let data = response.data.orders.map(value => {
            return {
              id: value.id,
              username: value.username,
              name: value.name,
              province: value.province,
              city: value.city,
              district: value.district,
              detail: value.detail,
              phone: value.phone,
              total: value.items.reduce((total, value) => total+value.price*value.amount, 0),
              createTime: value.createTime,
              items: JSON.stringify(value.items)
            }
          });
          return data
        })
        let sheet = XLSX.utils.json_to_sheet(ret)
        return sheet
      },
      sheet2blob: function (sheet, sheetName) {
        sheetName = sheetName || 'sheet1';
        let workbook = {
          SheetNames: [sheetName],
          Sheets: {}
        };
        workbook.Sheets[sheetName] = sheet;
        // 生成excel的配置项
        let wopts = {
          bookType: 'xlsx', // 要生成的文件类型
          bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
          type: 'binary'
        };
        let wbout = XLSX.write(workbook, wopts);
        let blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
        // 字符串转ArrayBuffer
        function s2ab(s) {
          let buf = new ArrayBuffer(s.length);
          let view = new Uint8Array(buf);
          for (let i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
          return buf;
        }
        return blob;
      },
      openDownloadDialog: function(url, saveName)
      {
        if(typeof url == 'object' && url instanceof Blob)
        {
          url = URL.createObjectURL(url); // 创建blob地址
        }
        var aLink = document.createElement('a');
        aLink.href = url;
        aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
        var event;
        if(window.MouseEvent) event = new MouseEvent('click');
        else
        {
          event = document.createEvent('MouseEvents');
          event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        }
        aLink.dispatchEvent(event);
      },
      handleConfirm: async function () {
        let sheet = await this.createSheet()
        let blob = this.sheet2blob(sheet)
        console.log(sheet)
        console.log(blob)
        this.openDownloadDialog(blob, 'origin.xlsx')
      }
    }
  }
</script>

<style scoped>

</style>
