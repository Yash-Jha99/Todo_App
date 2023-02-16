import { PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { Form, Input, InputRef, message, Space, Tag, theme, Tooltip, Typography } from 'antd';
import React, { useEffect, useRef, useState } from 'react';

type Todo = {
  key: number;
  title: string;
  description: string;
  tags: string[];
  status: string;
  createdAt: number;
  dueDate: number;
};

type Props = {
  addFormOpen: boolean;
  handleAddFormOpen: (value: React.SetStateAction<boolean>) => void;
  handleAdd: (value: API.TodoListItem) => Promise<boolean>;
  actionRef: any;
};

const AddForm = ({ handleAddFormOpen, addFormOpen, handleAdd, actionRef }: Props) => {
  const [form] = Form.useForm<Todo>();
  const { token } = theme.useToken();
  const [tags, setTags] = useState<string[]>([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);
  const editInputRef = useRef<InputRef>(null);

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [inputValue]);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditInputValue(e.target.value);
  };

  const handleEditInputConfirm = () => {
    const newTags = [...tags];
    newTags[editInputIndex] = editInputValue;
    setTags(newTags);
    setEditInputIndex(-1);
    setInputValue('');
  };

  const tagInputStyle: React.CSSProperties = {
    width: 100,
    verticalAlign: 'top',
  };

  const tagPlusStyle: React.CSSProperties = {
    background: token.colorBgContainer,
    borderStyle: 'dashed',
  };
  return (
    <ModalForm<Todo>
      title="Add Todo"
      form={form}
      onOpenChange={handleAddFormOpen}
      open={addFormOpen}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        onCancel: () => {
          setTags([]);
        },
      }}
      submitTimeout={2000}
      onFinish={async (value) => {
        console.log(typeof value.dueDate);
        if (value.title === undefined || value.title.trim() === '') {
          message.error('Title is mandatory');
          return;
        }

        if (value.description === undefined || value.description.trim() === '') {
          message.error('Description is mandatory');
          return;
        }

        if (value.status === undefined || value.status.trim() === '') {
          message.error('Status is mandatory');
          return;
        }

        if (value.dueDate && new Date(value.dueDate) <= new Date()) {
          message.error('Due date should be more than current date');
          return;
        }

        const reqBody = {
          key: Math.ceil(Math.random() * 1000000) + Date.now(),
          createdAt: Date.now(),
          title: value.title,
          description: value.description,
          tags: tags ?? [],
          dueDate: Number(new Date(value.dueDate)) ?? 0,
          status: value.status,
        };

        const success = await handleAdd(reqBody as API.TodoListItem);
        if (success) {
          handleAddFormOpen(false);
          setTags([]);
          if (actionRef.current) {
            actionRef.current.reload();
          }
        }
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="title"
          label="Title"
          tooltip="Upto 100 characters"
          placeholder="Please enter a title"
          fieldProps={{ maxLength: 100, showCount: true, required: true }}
          required
        />
        <ProFormSelect
          request={async () => [
            {
              value: 'close',
              label: 'Open',
            },
            {
              value: 'running',
              label: 'Working',
            },
            {
              value: 'online',
              label: 'Done',
            },
            {
              value: 'error',
              label: 'Over Due',
            },
          ]}
          width="xs"
          name="status"
          label="Status"
          required
        />
        <ProFormDatePicker name="dueDate" label="Due Date" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormTextArea
          width="md"
          name="description"
          label="Description"
          placeholder="Please enter a description"
          fieldProps={{ maxLength: 1000, showCount: true, required: true }}
          required
        />
        <ProForm.Group direction="vertical">
          <Typography style={{ paddingBottom: 8 }}>Tags</Typography>
          <Space direction="vertical" size={[0, 8]}>
            <Space size={[0, 4]} wrap>
              <Space size={[0, 8]} wrap>
                {tags.map((tag, index) => {
                  if (editInputIndex === index) {
                    return (
                      <Input
                        ref={editInputRef}
                        key={tag}
                        size="small"
                        style={tagInputStyle}
                        value={editInputValue}
                        onChange={handleEditInputChange}
                        onBlur={handleEditInputConfirm}
                        onPressEnter={handleEditInputConfirm}
                      />
                    );
                  }
                  const isLongTag = tag.length > 20;
                  const tagElem = (
                    <Tag
                      key={tag}
                      closable={true}
                      style={{ userSelect: 'none' }}
                      onClose={() => handleClose(tag)}
                    >
                      <span
                        onDoubleClick={(e) => {
                          if (index !== 0) {
                            setEditInputIndex(index);
                            setEditInputValue(tag);
                            e.preventDefault();
                          }
                        }}
                      >
                        {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                      </span>
                    </Tag>
                  );
                  return isLongTag ? (
                    <Tooltip title={tag} key={tag}>
                      {tagElem}
                    </Tooltip>
                  ) : (
                    tagElem
                  );
                })}
              </Space>
              {inputVisible ? (
                <Input
                  ref={inputRef}
                  type="text"
                  size="small"
                  style={tagInputStyle}
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputConfirm}
                  onPressEnter={handleInputConfirm}
                />
              ) : (
                <Tag style={tagPlusStyle} onClick={showInput}>
                  <PlusOutlined /> New Tag
                </Tag>
              )}
            </Space>
          </Space>
        </ProForm.Group>
      </ProForm.Group>
    </ModalForm>
  );
};
export default AddForm;
