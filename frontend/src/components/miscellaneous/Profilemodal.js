import React, { Children } from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Image,
  Text,
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { ViewIcon } from "@chakra-ui/icons";

const Profilemodal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton onClick={onOpen} d={{ base: "flex" }} icon={<ViewIcon />} />
      )}
      <Modal size={"lg"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h={"400px"}>
          <ModalHeader
            fontSize={"40px"}
            fontFamily="Work sans"
            d={"flex"}
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            d={"flex"}
            flexDir="column"
            alignItems={"center"}
            justifyContent="space-between"
          >
            <Image
              borderRadius={"full"}
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />
          </ModalBody>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            fontFamily="Work sans"
            alignItems={"center"}
            marginLeft="11%"
          >
            Email: {user.email}
          </Text>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Profilemodal;
