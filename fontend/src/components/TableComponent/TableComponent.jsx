import { Table } from 'antd';
import React, { useState } from 'react';
import Loading from '../../components/LoadingComponent/Loading'

const TableComponent = (props) => {
  const {selectionType = 'checkbox', data = [], isLoading = false, columns = [], handleDeleteMany } = props
  const [rowSelectedKey, setRowSelectedKeys] = useState([])

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKeys(selectedRowKeys)
    },
    // getCheckboxProps: (record) => ({
    //   disabled: record.name === 'Disabled User',
    //   // Column configuration not to be checkeds
    //   name: record.name,
    // }),
  };

  const handleDeleteAll = () => {
    handleDeleteMany(rowSelectedKey)
  }


  return (
    <Loading isLoading={isLoading}>
      {rowSelectedKey.length > 0 && (//Trong phần AdminUser với AdminProduct
      <div style={{background:'#1d1ddd', color:'#fff', fontWeight:"bold",padding:'10px', cursor:"pointer"}} onClick={handleDeleteAll}>
        Xoá Tất Cả
      </div>
      )}
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        {...props}
      />
    </Loading>
  )
}

export default TableComponent
