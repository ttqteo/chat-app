import React, { useContext, useMemo, useState } from "react";
import { AuthContext } from "./AuthProvider";
import useFirestore from "../hooks/useFirestore";

export const AppContext = React.createContext();

export default function AppProvider({ children }) {
  const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
  const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
  const [selectedRoomID, setSelectedRoomID] = useState("");
  const {
    user: { uid },
  } = useContext(AuthContext);
  /**
   * {
   *  name: 'roome name',
   *  description: 'mo ta',
   *  members: [uid1, uid2..],
   * }
   */
  const roomsCondition = useMemo(() => {
    return {
      fieldName: "members",
      operator: "array-contains",
      compareValue: uid,
    };
  }, [uid]);
  const rooms = useFirestore("rooms", roomsCondition);
  const selectedRoom = useMemo(
    () => rooms.find((room) => room.id === selectedRoomID) || {},
    [rooms, selectedRoomID]
  );
  const usersCondition = useMemo(() => {
    return {
      fieldName: "uid",
      operator: "in",
      compareValue: selectedRoom.members,
    };
  }, [selectedRoom.members]);
  const members = useFirestore("users", usersCondition);
  return (
    <AppContext.Provider
      value={{
        rooms,
        members,
        isAddRoomVisible,
        setIsAddRoomVisible,
        selectedRoom,
        selectedRoomID,
        setSelectedRoomID,
        isInviteMemberVisible,
        setIsInviteMemberVisible,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
