import TodoTable from './components/TodoTable';
import styles from './index.less';

const Todo = () => {
  return (
    <div className={styles.container}>
      <div className={styles.tableContainer}>
        <TodoTable />
      </div>
    </div>
  );
};

export default Todo;
