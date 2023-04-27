import React, { useRef, ChangeEvent } from "react";
import classNames from 'classNames'
import styles from './styles.less'
import useToast from './components/Toast'

interface ToolsProps {
  project: {
    loadContent: (val: any) => void
    dump: () => void
    toJSON: () => void
    getGeoJSON: () => any
  }
}

export default function Tools(props: ToolsProps) {
  const [toast, contextHolder] = useToast()
  const fileRef = useRef<HTMLInputElement>(null)

  // console.log(props.project.getGeoJSON())

  const onImport = async () => {
    try {
      const importData = await navigator.clipboard.readText()

      loadContent(importData)
    } catch (err) {
      toast.error(`剪切板读取失败，尝试切换为手动粘贴导入... ${err}`)
      console.warn('剪切板读取失败，尝试切换为手动粘贴导入...', err)

      const importData = window.prompt('将导出的页面数据复制到输入框')

      loadContent(importData)
    }
  }


  const onExportToJson = () => {
    const json = props.project.toJSON()
    copyText(JSON.stringify(json))
    toast.success('已导出到剪贴板')
  }

  const onExportToFileToJson = () => {
    const json = props.project.toJSON()

    downloadToFile({ name: `mybricks_tojson_${getDateTime()}.json`, content: json })
  }


  const onExport = () => {
    const json = props.project.dump()
    copyText(JSON.stringify(json))
    toast.success('已导出到剪贴板')
  }

  const onExportToFile = () => {
    const json = props.project.dump()

    downloadToFile({ name: `mybricks_dump_${getDateTime()}.json`, content: json })
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

  const loadContent = (importData: string | null) => {
    if (!importData) {
      toast.error('导入失败，请检查')
      return
    }

    try {
      const pageData = JSON.parse(importData)
      props.project.loadContent(pageData)
      toast.success('导入完成')
    } catch (err) {
      toast.error(`导入失败，请检查 ${err}`)
      console.error('非法数据格式, 请检查', err);
    }
  }

  // const geoJSONOnChange = (e) => {
  //   const data = e.target.value
  //   console.log(data)
  // }

  return (
    <>
      <div className={styles.toolsContainer}>
        <div className={styles.toolsTitle}>调试工具</div>
        <div className={styles.toolsContent}>
          <div className={styles.toolsItem}>
            <div className={styles.toolsItemTitle}>页面协议（Dump）</div>
            <div className={styles.toolsItemContent}>
              <button className={classNames(styles.toolsIBtn, styles.toolsIBtnBlock)} onClick={() => onImport()}>从剪切板中导入</button>
              <button className={classNames(styles.toolsIBtn, styles.toolsIBtnBlock)} onClick={() => onExport()}>导出到剪切板</button>
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

              <button className={classNames(styles.toolsIBtn, styles.toolsIBtnBlock)} onClick={() => onExportToFile()}>导出到文件</button>
              {/* <div>
                <textarea style={{ width: '100%' }} defaultValue={JSON.stringify(props.project.getGeoJSON(), null, 2)} onChange={geoJSONOnChange}></textarea>
              </div> */}
            </div>
          </div>

          <div className={styles.toolsItem}>
            <div className={styles.toolsItemTitle}>页面产物（ToJSON）</div>
            <div className={styles.toolsItemContent}>
              <button className={classNames(styles.toolsIBtn, styles.toolsIBtnBlock)} onClick={() => onExportToJson()}>导出到剪切板</button>
              <button className={classNames(styles.toolsIBtn, styles.toolsIBtnBlock)} onClick={() => onExportToFileToJson()}>导出到文件</button>
            </div>
          </div>

        </div>
      </div>
      {contextHolder}
    </>
  )
}

function getDateTime() {
  const date = new Date()
  const Y = date.getFullYear() + '-'
  const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  const D = date.getDate() + ' '
  const h = date.getHours() + ':'
  const m = date.getMinutes() + ':'
  const s = date.getSeconds()

  return Y + M + D + h + m + s
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

function downloadToFile ({ content, name }: { content: any, name: string }) {
  const eleLink = document.createElement('a')
  eleLink.download = name
  eleLink.style.display = 'none'

  const blob = new Blob([JSON.stringify(content)])

  eleLink.href = URL.createObjectURL(blob)
  document.body.appendChild(eleLink)
  eleLink.click()
  document.body.removeChild(eleLink)
}