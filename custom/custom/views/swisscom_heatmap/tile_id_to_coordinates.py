import math
import typing as T

TILE_W = 100
TILE_H = 100


def _cantor_pairing(n1: int, n2: int) -> int:
    """Cantor pairing function."""
    return ((n1 + n2) * (n1 + n2 + 1)) // 2 + n2


def _cantor_unpairing(n: int) -> T.Tuple[int, int]:
    """Inverse Cantor pairing function."""
    w = int((math.sqrt(8 * n + 1) - 1) // 2)
    t = (w * w + w) // 2
    n2 = n - t
    n1 = w - n2
    return n1, n2


def tile_ll_at(x: float, y: float) -> T.Tuple[int, int]:
    """Given a point (LV03), returns the lower-left corner of the tile it belongs to."""
    tix, tiy = x // TILE_W, y // TILE_H
    return int(tix * TILE_W), int(tiy * TILE_H)


def tile_ll_to_id(tx: int, ty: int) -> int:
    """Given the lower-left corner (LV03) of a tile, returns the id of that tile."""
    tix, tiy = tx // TILE_W, ty // TILE_H
    return _cantor_pairing(tix, tiy)


def tile_id_to_ll(tid: int) -> T.Tuple[int, int]:
    """Given the id of a tile, returns the lower-left corner (LV03) of that tile."""
    tix, tiy = _cantor_unpairing(tid)
    return tix * TILE_W, tiy * TILE_H
