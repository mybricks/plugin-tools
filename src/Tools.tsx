import React from "react";
import styles from './styles.less'

interface ToolsProps {
  project: {
    loadContent: (val: any) => void
    dump: () => void
  }
}

export default function Tools (props: ToolsProps) {
  const onImport = () => {
    const importData = window.prompt('将导出的页面数据复制到输入框');

    if (!importData) return;
    
    try {
      const pageData = JSON.parse(importData)
      props.project.loadContent(pageData)
    } catch (err) {
      console.error(err);
    }
  }

  const onExport = () => {
    const json = props.project.dump()
    if (copyText(JSON.stringify(json))) {
      alert('已导出到剪贴板')
    }
  }

  const onExportToFile = () => {
    const json = props.project.dump()
    let link = document.createElement('a')
    link.download = `mybricks_${getDateTime()}.json`
    link.href = 'data:text/plain,' + JSON.stringify(json)
    link.click()
  }

  return (
    <div className={styles.toolsContainer}>
      <div className={styles.toolsTitle}>调试工具</div>
      <div className={styles.toolsContent}>
        <div className={styles.toolsItem}>
          <div className={styles.toolsItemTitle}>页面协议</div>
          <div className={styles.toolsItemContent}>
            <button className={styles.toolsIBtn} onClick={() => onImport()}>导入</button>
            <button className={styles.toolsIBtn} onClick={() => onExport()}>导出到剪切板</button>
            <button className={styles.toolsIBtn} onClick={() => onExportToFile()}>导出到文件</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function getDateTime () {
  const date = new Date()
  const Y = date.getFullYear() + '-'
  const M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-'
  const D = date.getDate() + ' '
  const h = date.getHours() + ':'
  const m = date.getMinutes() + ':'
  const s = date.getSeconds()

  return Y+M+D+h+m+s
}


function copyText(txt: string): boolean {
  const input = document.createElement('input')
  document.body.appendChild(input)
  input.value = txt
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
  return true;
}