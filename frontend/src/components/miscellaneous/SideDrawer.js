import {
  Avatar,
  Box,
  Input,
  Spinner,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import React, { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/menu";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import Profilemodal from "./Profilemodal";
import { useHistory } from "react-router-dom";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import api from "../../api/services";
import ChatLoading from "../ChatLoading";
import UserListitem from "../UserAvatar/UserListitem";
import { getSender } from "../../config/ChatLogics";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searcResult, setSearchResult] = useState([]);
  const [loading, setloading] = useState(false);
  const [loadingChat, setloadingChat] = useState();
  const {
    setSelectedChat,
    user,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const history = useHistory();
  const logoutuser = () => {
    localStorage.removeItem("userinfo");
    history.push("/");
  };
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const toast = useToast();
  const handleSearch = async () => {
    console.log(search);
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await api.get(`/api/users/?search=${search}`, config);
      setloading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const accesChat = async (userId) => {
    console.log(userId);
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
      };
      const { data } = await api.post("api/chat", { userID: userId }, config);
      console.log(userId);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setloadingChat(false);
      onClose();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  return (
    <>
      <Box
        d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search User to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Hey!!
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No new messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <Profilemodal user={user}>
                <MenuItem>My Profile</MenuItem>
              </Profilemodal>
              <MenuItem onClick={logoutuser}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searcResult?.map((user) => (
                <UserListitem
                  user={user}
                  key={user._id}
                  handleFunction={() => accesChat(user._id)}
                />
              ))
            )}
            {loadingChat && <Spinner ml={"auto"} d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
