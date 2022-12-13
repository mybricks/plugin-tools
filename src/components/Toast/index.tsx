import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle, useMemo } from "react"
import { createPortal } from "react-dom"
import style from './style.less'

let toastCount = 0;

const Toast = forwardRef((props, ref) => {
  const [toastList, setToastList] = useState<any[]>([])

  useImperativeHandle(ref, () => {
    return {
      open: (text: string) => {
        open(text)
      }
    }
  })

  const open = (text: string) => {
    toastList.push({
      id: getUuid(),
      text
    })

    setToastList([...toastList])
  }

  const close = (id: string) => {
    const newList = toastList.filter(item => item.id !== id)
    setToastList(newList)
  }

  return createPortal((
    <div className={style.toast}>
      {
        toastList.reverse().map(item => {
          return <ToastItem {...item} onClose={close} key={item.id} />
        })
      }
    </div>
  ), document.body)
})

const getUuid = () => {
    return 'toast' + new Date().getTime() + '-' + toastCount++;
};

function ToastItem ({ id, text, onClose }: { id: string, text: string, onClose: (id: string) => void}) {
  const timer = useRef<any>()

  useEffect(() => {
    timer.current = setTimeout(() => {
      if (onClose) {
        onClose(id);
      }
    }, 2000)

    return () => {
      clearTimeout(timer.current)
    }
  }, [])

  return (
    <div className={style.toastItem}>
      <div className={style.toastItemContent}>
        <span>
          <svg className={style.icon} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2690" width="1em" height="1em" fill="currentColor"><path d="M512 85.333333c235.637333 0 426.666667 191.029333 426.666667 426.666667S747.637333 938.666667 512 938.666667 85.333333 747.637333 85.333333 512 276.362667 85.333333 512 85.333333z m182.613333 297.354667a32 32 0 0 0-45.258666 0.032L458.922667 573.44l-84.341334-83.989333a32 32 0 0 0-45.162666 45.344l106.986666 106.549333a32 32 0 0 0 45.226667-0.064l213.013333-213.333333a32 32 0 0 0-0.032-45.258667z" p-id="2691"></path></svg>
        </span>
        <span className={style.toastItemContentText}>{text}</span>
      </div>
    </div>
  )
}

export default function useToast(): [{ open: (text: string) => void }, React.ReactElement] {
  const toastRef = React.useRef<any>();

  const contextHolder = (
    <Toast ref={toastRef} />
  );

  const api = useMemo(() => {
    return {
      open: (text: string) => {
        toastRef.current?.open(text)
      }
    }
  }, [])

  return [api, contextHolder]
}