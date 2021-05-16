import React, { useEffect, useState } from 'react'
import {
  Form, Input, Button, Card, Upload, Modal,
} from 'antd'
import { css } from '@emotion/css'
import { useMutation } from '@apollo/client'
import { FormItemProps } from 'antd/lib/form'
import { PlusOutlined } from '@ant-design/icons'
import ImgCrop from 'antd-img-crop'
import { UPDATE_ACCOUNT } from 'queries'
import { useForm } from 'antd/lib/form/Form'
import { gUserMe } from 'appState/appState'
import { AccountUpdate } from 'queries/types/AccountUpdate'

const normFile: FormItemProps['getValueFromEvent'] = (e) => (Array.isArray(e) ? e : e && e.fileList)
const cssFormItem = css`
  display: block;
`

type FormProps = React.ComponentProps<typeof Form>
export default () => {
  const [form] = useForm()
  const [fileList, setFileList] = useState<any[]>([])

  const [updateAccount, {
    data: updateAccountReturnData,
    loading: updateAccountLoading,
  }] = useMutation<AccountUpdate>(UPDATE_ACCOUNT)

  const userMe = gUserMe()

  useEffect(() => {
    const avtarToUse = userMe?.avatar || userMe?.avatar
    if (avtarToUse) {
      const {
        uri,
        filename,
      } = avtarToUse
      setFileList([{
        uid: uri,
        filename,
        status: 'done',
        url: `${process.env.REACT_APP_STORAGE_URI}/${uri}`,
      }])
    } else {
      setFileList([])
    }
    return () => {}
  }, [updateAccountReturnData, userMe])

  const onFinish: FormProps['onFinish'] = (valuesArg: any) => {
    const values = valuesArg
    values.avatar = fileList.length && fileList[0].originFileObj ? {
      uid: fileList[0].uid,
      name: fileList[0].name,
      type: fileList[0].type,
      originFileObj: fileList[0].originFileObj,
    } : undefined

    values.removeAvatar = Boolean(!fileList.length && userMe?.avatar?.uri)

    updateAccount({
      variables: {
        id: userMe?.id,
        update: values,
      },
      refetchQueries: ['userMe'],
    }).then(() => {
      Modal.info({
        title: 'Your account has been updated!',
        content: null,
      })
    })
  }

  const onFinishFailed: FormProps['onFinishFailed'] = (errorInfo) => {
    console.error('Failed:', errorInfo)
  }


  const onChange = ({ fileList: newFileList }: any) => {
    setFileList(newFileList)
  }

  const onReset = () => {
    form.resetFields()
    const avtarToUse = userMe?.avatar
    if (avtarToUse) {
      const {
        uri,
        filename,
      } = avtarToUse
      setFileList([{
        uid: uri,
        filename,
        status: 'done',
        url: `${process.env.REACT_APP_STORAGE_URI}/${uri}`,
      }])
    }
  }


  const initialValues: any = {
    fullName: userMe?.fullName,
    email: userMe?.email,
  }

  return (
    <Card
      title={(
        <div>
          Account settings
        </div>
      )}
    >
      <Form
        form={form}
        name="Account settings"
        initialValues={initialValues}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <div className={css`display: flex;`}>
          <div>
            <Form.Item
              name="avatar"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              noStyle
            >
              <ImgCrop rotate>
                <Upload
                  action="http://1"
                  method="PUT"
                  multiple={false}
                  listType="picture-card"
                  showUploadList={{
                    showPreviewIcon: false,
                  }}
                  onChange={onChange}
                  fileList={fileList}
                >
                  { fileList.length === 0
                    && (
                      <div>
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Upload </div>
                      </div>
                    )}
                </Upload>
              </ImgCrop>
            </Form.Item>
          </div>
          <div className={css`width: 100%; margin-left: 20px; `}>
            <Form.Item
              label="Full Name"
              name="fullName"
              rules={[{ required: true, message: 'Please input your full name!' }]}
              className={cssFormItem}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{
                required: true, message: 'Please input your email',
              },
              {
                type: 'email',
                message: 'Not a valid email',
              }]}
              className={cssFormItem}
            >
              <Input />
            </Form.Item>
          </div>
        </div>
        <div
          className={css`
            display: flex;
            width: 100%;
            justify-content: space-between;
          `}
        >
          <Button
            ghost
            type="primary"
            htmlType="reset"
            onClick={onReset}
          >
            Reset
          </Button>
          <Button ghost type="primary" loading={updateAccountLoading} htmlType="submit">
            Save
          </Button>
        </div>
      </Form>
    </Card>
  )
}
