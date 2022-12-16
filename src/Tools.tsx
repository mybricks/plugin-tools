import React, { useRef, ChangeEvent } from "react";
import classNames from 'classNames'
import styles from './styles.less'
import useToast from './components/Toast'

interface ToolsProps {
  project: {
    loadContent: (val: any) => void
    dump: () => void
  }
}

export default function Tools (props: ToolsProps) {
  const [toast, contextHolder] = useToast()
  const fileRef = useRef<HTMLInputElement>(null)

  const onImport = async () => {
    try {
      const importData = await navigator.clipboard.readText()

      loadContent(importData)
    } catch (err) {
      console.error(err);
    }
  }

  const onExport = () => {
    const json = props.project.dump()
    copyText(JSON.stringify(json))
    toast.open('已导出到剪贴板')
  }

  const onExportToFile = () => {
    const json = props.project.dump()
    const eleLink = document.createElement('a')
    eleLink.download = `mybricks_${getDateTime()}.json`
    eleLink.style.display = 'none'
    const blob = new Blob([JSON.stringify(json)])
    eleLink.href = URL.createObjectURL(blob)
    document.body.appendChild(eleLink)
    eleLink.click()
    document.body.removeChild(eleLink)
  }

  const onImportForFile = () => {
    fileRef.current?.click()
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    if (files) {
      const reader = new FileReader()
      reader.readAsText(files[0])
      reader.onload = (v) => {
        const text = v.target?.result as string
        loadContent(text)
      }
    }
  }

  const loadContent = (importData: string) => {
    if (!importData) return;

    try {
      const pageData = JSON.parse(importData)
      props.project.loadContent(pageData)
      toast.open('导入完成')
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <>
      <div className={styles.toolsContainer}>
        <div className={styles.toolsTitle}>调试工具</div>
        <div className={styles.toolsContent}>
          <div className={styles.toolsItem}>
            <div className={styles.toolsItemTitle}>页面协议</div>
            <div className={styles.toolsItemContent}>
              <button className={classNames(styles.toolsIBtn, styles.toolsIBtnBlock)} onClick={() => onImport()}>从剪切板中导入</button>
              <div>
                <input
                  style={{ display: 'none' }}
                  ref={fileRef}
                  type="file"
                  accept="application/json"
                  onChange={handleFileChange}
                />
                <button
                  className={classNames(styles.toolsIBtn, styles.toolsIBtnBlock)}
                  onClick={() => onImportForFile()}>从文件中导入</button>
              </div>
              <button className={classNames(styles.toolsIBtn, styles.toolsIBtnBlock)} onClick={() => onExport()}>导出到剪切板</button>
              <button className={classNames(styles.toolsIBtn, styles.toolsIBtnBlock)} onClick={() => onExportToFile()}>导出到文件</button>
            </div>
          </div>
        </div>
      </div>
      {contextHolder}
    </>
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