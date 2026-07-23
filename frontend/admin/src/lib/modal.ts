import { modalStore, type ModalTone } from "@/lib/modal-store";

function alert(tone: ModalTone, message: string) {
  modalStore.show({ kind: "alert", tone, message });
}

export const modal = {
  success: (message: string) => alert("success", message),
  error: (message: string) => alert("error", message),
  info: (message: string) => alert("info", message),
  confirm({
    message,
    confirmLabel,
    cancelLabel,
    onConfirm,
  }: {
    message: string;
    confirmLabel: string;
    cancelLabel: string;
    onConfirm: () => void | Promise<void>;
  }) {
    modalStore.show({ kind: "confirm", message, confirmLabel, cancelLabel, onConfirm });
  },
};
