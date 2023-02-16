import { addTodo, removeTodo, todo, updateTodo } from '@/services/todo/api';
import { DownOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Dropdown, message, Popconfirm, Space, Tag } from 'antd';
import { useEffect, useRef, useState } from 'react';
import AddForm from './AddForm';
import EditForm from './editForm';

export const valueEnum: any = {
  0: 'close',
  1: 'running',
  2: 'online',
  3: 'error',
};

export const statusOptions: any = {
  close: { text: 'Open', status: 'Default' },
  running: { text: 'Working', status: 'Processing' },
  online: { text: 'Done', status: 'Success' },
  error: { text: 'Over Due', status: 'Error' },
};

const colors = [
  'magenta',
  'red',
  'volcano',
  'orange',
  'gold',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
];

export type TableListItem = {
  key: number;
  title: string;
  description: string;
  tags: string[];
  status: string;
  createdAt: number;
  dueDate: number;
};

const TodoTable = () => {
  const [todoData, setTodoData] = useState<TableListItem[]>([]);
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [editKey, setEditKey] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState<(string | number)[]>([]);
  const ref = useRef<ActionType>();
  const tags: { key: string; label: string }[] = [];
  if (todoData.length !== 0) {
    todoData.forEach((element) => {
      tags.push(
        ...element.tags.map((item, i) => ({
          label: item,
          key: item + i,
        })),
      );
    });
  }

  const handleGet = async () => {
    const data = await todo();
    if (data?.data) {
      setTodoData(data.data);
      console.log(data.data);
    }
  };

  const handleAdd = async (fields: API.TodoListItem) => {
    const hide = message.loading('Loading');
    try {
      await addTodo({ ...fields });
      hide();
      handleGet();
      message.success('Added successfully');
      return true;
    } catch (error) {
      hide();
      message.error('Adding failed, please try again!');
      return false;
    }
  };

  const handleUpdate = async (fields: API.TodoListItem) => {
    const hide = message.loading('Configuring');
    try {
      await updateTodo({
        ...fields,
      });
      hide();
      handleGet();
      message.success('Todo Updated');
      return true;
    } catch (error) {
      hide();
      message.error('Update failed');
      return false;
    }
  };

  const handleRemove = async (selectedRowKeys: (string | number)[]) => {
    const hide = message.loading('Loading');
    if (!selectedRowKeys) return;
    try {
      await removeTodo(selectedRowKeys);
      hide();
      message.success('Deleted successfully and will refresh soon');
      handleGet();
      //@ts-ignore
      ref.current?.clearSelected();
      setSelectedRowKeys([]);
      ref.current?.reload();

      return true;
    } catch (error) {
      hide();
      message.error('Delete failed, please try again');
      return false;
    }
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'Title',
      dataIndex: 'title',
      sorter: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      sorter: true,
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      render: (_, record) => (
        <div>
          {record.tags.map((item, i) => (
            <Tag key={item + i} color={colors[Math.ceil(Math.random() * 10)]}>
              {item}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: 'CreatedAt',
      dataIndex: 'createdAt',
      valueType: 'date',
      sorter: (a, b) => a.createdAt - b.createdAt,
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      valueType: 'date',
      sorter: (a, b) => a.dueDate - b.dueDate,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: statusOptions,
      filters: true,
      // render: (_, item) => <Badge status={item.status} text={item.text} />,
    },
    {
      title: 'Edit',
      key: 'edit',
      valueType: 'option',
      width: 120,
      render: (_, record) => (
        <a
          onClick={() => {
            setEditKey(record.key);
            setEditFormOpen(true);
          }}
          key="link"
        >
          Edit
        </a>
      ),
    },
  ];

  useEffect(() => {
    handleGet();
  }, []);

  return (
    <>
      <ProTable<TableListItem>
        actionRef={ref}
        columns={columns}
        rowSelection={{
          defaultSelectedRowKeys: [],
          alwaysShowAlert: false,
        }}
        request={(params, sorter, filter) => {
          if (sorter.title || sorter.description) {
            return Promise.resolve({
              data:
                sorter.title === 'ascend' || sorter.description === 'ascend'
                  ? todoData.sort()
                  : todoData.sort().reverse(),
              success: true,
            });
          }
          if (filter.status) {
            const newfilter = filter.status?.map((item) => item);
            return Promise.resolve({
              data: todoData.filter((item) => newfilter.includes(item.status)),
              success: true,
            });
          }
          return Promise.resolve({
            data: todoData,
            success: true,
          });
        }}
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => {
          // if (selectedRowKeys.length === 0) return false;
          if (selectedRowKeys.length !== 0) {
            setSelectedRowKeys(selectedRowKeys);
          }
          return (
            <Space size={24}>
              <span>
                {selectedRowKeys.length} item selected
                <a style={{ marginInlineStart: 8 }} onClick={onCleanSelected}>
                  Deselect
                </a>
              </span>
            </Space>
          );
        }}
        tableAlertOptionRender={() => {
          return (
            <Space size={16}>
              <Popconfirm
                title="Delete todos"
                description="Are you sure to delete todos?"
                onConfirm={() => {
                  handleRemove(selectedRowKeys);
                }}
                okText="Yes"
                cancelText="No"
                placement="leftTop"
              >
                <a>Delete</a>
              </Popconfirm>
            </Space>
          );
        }}
        headerTitle="Todo List"
        toolbar={{
          multipleLine: true,
          search: {
            onSearch: (value: string) => {
              handleGet();
              setTodoData(
                [...todoData].filter(
                  (item) =>
                    item.tags.some((elem) => elem.toLowerCase().includes(value.toLowerCase())) ||
                    item.description.toLowerCase().includes(value.toLowerCase()) ||
                    item.title.toLowerCase().includes(value.toLowerCase()) ||
                    statusOptions[item.status].text.toLowerCase() === value.toLowerCase(),
                ),
              );
              ref?.current?.reload();
            },
          },
          actions: [
            <Dropdown
              key="overlay"
              menu={{
                items: tags,
                onClick: (e) => {
                  handleGet();
                  setTodoData(
                    [...todoData].filter((item) =>
                      //@ts-ignore
                      item.tags.includes(tags.find((elem) => elem.key === e.key).label),
                    ),
                  );
                  ref?.current?.reload();
                },
              }}
            >
              <Button>
                Tags
                <DownOutlined
                  style={{
                    marginInlineStart: 8,
                  }}
                />
              </Button>
            </Dropdown>,
            <Button
              key="add"
              type="primary"
              onClick={() => {
                setAddFormOpen(true);
              }}
            >
              Add Todo
            </Button>,
          ],
        }}
        search={false}
        rowKey="key"
        pagination={{
          pageSize: 8,
          onChange: (page) => console.log(page),
          position: ['bottomCenter'],
        }}
        dateFormatter="string"
      />
      <AddForm
        addFormOpen={addFormOpen}
        handleAddFormOpen={setAddFormOpen}
        handleAdd={handleAdd}
        actionRef={ref}
      />
      <EditForm
        editFormOpen={editFormOpen}
        handleEditFormOpen={setEditFormOpen}
        handleEdit={handleUpdate}
        actionRef={ref}
        todoData={todoData.find((item) => item.key === editKey)}
      />
    </>
  );
};

export default TodoTable;
