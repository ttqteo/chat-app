import { Avatar, Form, Modal, Select, Spin } from "antd";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { AppContext } from "../../Context/AppProvider";
import { debounce } from "lodash";
import { db } from "../../firebase/config";
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

function DebounceSelect({ fetchOptions, debounceTimeout = 300, ...props }) {
  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState([]);

  const debounceFetcher = useMemo(() => {
    const loadOptions = (value) => {
      setOptions([]);
      setFetching(true);
      fetchOptions(value, props.curmembers).then((newOptions) => {
        setOptions(newOptions);
        setFetching(false);
      });
    };
    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout, fetchOptions]);

  useEffect(() => {
    return () => {
      setOptions([]);
    };
  }, []);

  return (
    <>
      <Select
        labelInValue
        filterOption={false}
        onSearch={debounceFetcher}
        notFoundContent={fetching ? <Spin size="small" /> : null}
        {...props}
      >
        {options.map((opt) => (
          <Select.Option key={opt.value} value={opt.value} title={opt.label}>
            <Avatar size="small" src={opt.photoURL}>
              {opt.photoURL ? "" : opt.label?.charAt(0)?.toUpperCase()}
            </Avatar>
            {`${opt.label}`}
          </Select.Option>
        ))}
      </Select>
    </>
  );
}

async function fetchUserList(search, curmembers) {
  return getDocs(
    query(
      collection(db, "users"),
      where("keywords", "array-contains", search),
      orderBy("displayName"),
      limit(20)
    )
  ).then((snapshot) => {
    return snapshot.docs
      .map((doc) => ({
        label: doc.data().displayName,
        value: doc.data().uid,
        photoURL: doc.data().photoURL,
      }))
      .filter((opt) => !curmembers.includes(opt.value));
  });
}

export default function InviteMemberModal() {
  const {
    isInviteMemberVisible,
    setIsInviteMemberVisible,
    selectedRoomID,
    selectedRoom,
  } = useContext(AppContext);
  const [value, setValue] = useState([]);
  const [form] = Form.useForm();

  const handleOk = () => {
    form.resetFields();
    setValue([]);
    //update member
    const roomRef = doc(collection(db, "rooms"), selectedRoomID);
    updateDoc(roomRef, {
      members: [...selectedRoom.members, ...value.map((val) => val.value)],
    });
    setIsInviteMemberVisible(false);
  };

  const handleCancel = () => {
    form.resetFields();
    setValue([]);
    setIsInviteMemberVisible(false);
  };

  return (
    <div>
      <Modal
        title="Mời thêm thành viên"
        visible={isInviteMemberVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Form form={form} layout="vertical">
          <DebounceSelect
            mode="multiple"
            label="Tên các thành viên"
            value={value}
            placeholder="Nhập tên thành viên"
            fetchOptions={fetchUserList}
            onChange={(newValue) => setValue(newValue)}
            style={{ width: "100%" }}
            curmembers={selectedRoom.members}
          />
        </Form>
      </Modal>
    </div>
  );
}
